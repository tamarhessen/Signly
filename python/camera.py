from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests
# Load the pre-trained model
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

# Initialize webcam and hand detection
cap = cv2.VideoCapture(0)
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)
labels_dict = {0: 'A', 1: 'B', 2: 'L', 3: 'Nothing'}  # Added 'Nothing' as an option

# Configure strict detection parameters
CONFIDENCE_THRESHOLD = 0.70  # Very high confidence requirement (95%)
FRAME_CONSISTENCY = 5  # Number of consecutive frames needed
POSITION_TOLERANCE = 0.1  # Maximum allowed variation in hand position

# Tracking variables
current_gesture = 'Nothing'  # Default to 'Nothing'
last_gesture = ''
gesture_count = 0
last_positions = []  # Store last hand positions for stability check

def check_hand_stability(current_positions, tolerance):
    """Check if hand position is stable across frames"""
    if not last_positions:
        return True
    
    last_pos = last_positions[-1]
    return all(abs(c - l) < tolerance for c, l in zip(current_positions, last_pos))

def generate_frame():
    global current_gesture, last_gesture, gesture_count, last_positions
    
    while True:
        data_aux = []
        x_ = []
        y_ = []
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame, exiting...")
            break

        H, W, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)
        
        # Default to 'Nothing' if no hands detected
        if not results.multi_hand_landmarks:
            current_gesture = 'Nothing'
            gesture_count = 0
            last_positions = []
        else:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())

                # Extract hand landmarks
                x_.clear()
                y_.clear()
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    x_.append(x)
                    y_.append(y)

                # Prepare data for prediction
                data_aux = []
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))

                if len(data_aux) != 42:
                    continue

                # Get prediction and confidence
                prediction = model.predict([np.asarray(data_aux)])
                prediction_proba = model.predict_proba([np.asarray(data_aux)])
                max_confidence = np.max(prediction_proba)
                predicted_character = labels_dict[int(prediction[0])]

                # Check confidence and stability
                current_position = [np.mean(x_), np.mean(y_)]
                is_stable = check_hand_stability(current_position, POSITION_TOLERANCE)
                
                if max_confidence >= CONFIDENCE_THRESHOLD and is_stable:
                    if predicted_character == last_gesture:
                        gesture_count += 1
                    else:
                        gesture_count = 1
                        last_gesture = predicted_character
                    
                    # Update current gesture only if we have enough consistent frames
                    if gesture_count >= FRAME_CONSISTENCY:
                        current_gesture = predicted_character
                else:
                    current_gesture = 'Nothing'
                    gesture_count = 0

                # Update position history
                last_positions.append(current_position)
                if len(last_positions) > FRAME_CONSISTENCY:
                    last_positions.pop(0)

                # Draw bounding box and label
                x1 = int(min(x_) * W) - 10
                y1 = int(min(y_) * H) - 10
                x2 = int(max(x_) * W) - 10
                y2 = int(max(y_) * H) - 10
                
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
                cv2.putText(frame, f"{current_gesture} ({max_confidence:.2f})", 
                          (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                          1.3, (0, 0, 0), 3, cv2.LINE_AA)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frame(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detect_gesture')
def detect_gesture():
    return jsonify({'gesture': current_gesture})

if __name__ == '__main__':
    app.run(debug=True, threaded=True)