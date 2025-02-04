import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@mediapipe/hands';
import { Camera } from "@mediapipe/camera_utils";


const SignLanguageRecognition = () => {
  const videoRef = useRef(null);
  const [landmarksData, setLandmarksData] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    };

    setupCamera();
    startHandTracking();
  }, []);

  const startHandTracking = () => {
    const hands = new handpose.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        // דילוג על SIMD
      });
      

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0].map((point) => ({
          x: point.x,
          y: point.y,
          z: point.z
        }));

        if (isRecording) {
          saveLandmarks(landmarks);
        }
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
    });

    camera.start();
  };

  const saveLandmarks = (landmarks) => {
    setLandmarksData((prevData) => [...prevData, landmarks]);

    // שמירת הנתונים כקובץ JSON
    const jsonData = JSON.stringify(landmarks);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const startRecording = () => {
    setIsRecording(true);
    setLandmarksData([]); // אתחול נתוני ההקלטה
  };

  const stopRecording = () => {
    setIsRecording(false);
    // שמירת כל הנתונים כקובץ JSON
    const jsonData = JSON.stringify(landmarksData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landmarks_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveCSV = () => {
    const csvRows = [];
    const headers = ['x', 'y', 'z'];
    csvRows.push(headers.join(','));

    landmarksData.forEach((landmark) => {
      const row = landmark.map((point) => `${point.x},${point.y},${point.z}`);
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landmarks_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>זיהוי שפת סימנים - סימן "A"</h2>
      <video ref={videoRef} autoPlay playsInline className="video-feed" />
      <div>
        <button onClick={startRecording}>התחל הקלטה</button>
        <button onClick={stopRecording}>עצור הקלטה</button>
        <button onClick={saveCSV}>שמור כ-CSV</button>
      </div>
      <h3>נתוני נקודות הציון (landmarks) נשמרו!</h3>
    </div>
  );
};

export default SignLanguageRecognition;
