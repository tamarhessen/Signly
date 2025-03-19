from flask import Flask, Response, jsonify
import cv2
import mediapipe as mp
import pickle
import numpy as np

app = Flask(__name__)

# Load the pre-trained model
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

# Initialize webcam and hand detection
cap = cv2.VideoCapture(0)
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I',
    9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q',
    17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z',
    26: 'Nothing'
}

# הגדרת רמות לכל אות בא"ב
letter_levels = {
    'A': 1, 'B': 1, 'C': 1, 'D': 1, 'E': 1, 'F': 1, 'G': 1, 'H': 1, 'I': 1,
    'J': 1, 'K': 1, 'L': 1, 'M': 1, 'N': 1, 'O': 1, 'P': 1, 'Q': 1, 'R': 1,
    'S': 1, 'T': 1, 'U': 1, 'V': 1, 'W': 1, 'X': 1, 'Y': 1, 'Z': 1
}


CONFIDENCE_THRESHOLD = 0.50
FRAME_CONSISTENCY = 5
POSITION_TOLERANCE = 0.1

current_gesture = 'Nothing'
last_gesture = ''
gesture_count = 0
last_positions = []


def check_hand_stability(current_positions, tolerance):
    if not last_positions:
        return True
    last_pos = last_positions[-1]
    return all(
        abs(c - l) < tolerance for c, l in zip(current_positions, last_pos))


def generate_frame():
    global current_gesture, last_gesture, gesture_count, last_positions
    while True:
        data_aux = []
        x_ = []
        y_ = []
        ret, frame = cap.read()
        if not ret:
            break
        H, W, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

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
                x_.clear()
                y_.clear()
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    x_.append(x)
                    y_.append(y)

                data_aux = [coord for i in range(len(hand_landmarks.landmark))
                            for coord in (
                            hand_landmarks.landmark[i].x - min(x_),
                            hand_landmarks.landmark[i].y - min(y_))]

                if len(data_aux) != 42:
                    continue

                prediction = model.predict([np.asarray(data_aux)])
                prediction_proba = model.predict_proba([np.asarray(data_aux)])
                max_confidence = np.max(prediction_proba)
                predicted_character = labels_dict[int(prediction[0])]

                current_position = [np.mean(x_), np.mean(y_)]
                is_stable = check_hand_stability(current_position,
                                                 POSITION_TOLERANCE)

                if max_confidence >= CONFIDENCE_THRESHOLD and is_stable:
                    if predicted_character == last_gesture:
                        gesture_count += 1
                    else:
                        gesture_count = 1
                        last_gesture = predicted_character
                    if gesture_count >= FRAME_CONSISTENCY:
                        current_gesture = predicted_character
                else:
                    current_gesture = 'Nothing'
                    gesture_count = 0

                last_positions.append(current_position)
                if len(last_positions) > FRAME_CONSISTENCY:
                    last_positions.pop(0)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()
        yield (
                    b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
    response = Response(generate_frame(),
                        mimetype='multipart/x-mixed-replace; boundary=frame')
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/detect_gesture')
def detect_gesture():
    global current_gesture
    level = letter_levels.get(current_gesture, 1)
    response = jsonify({'gesture': current_gesture, 'level': level})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers[
        "Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


if __name__ == '__main__':
    app.run(debug=True, threaded=True, port=5001)