import React, { useState, useEffect } from 'react';
import { Card } from '../components/card';
import './Lesson.css';
import { useLocation } from 'react-router-dom';


function Lesson() {
    const levels = ['L', 'A', 'B']; // Define the sequence of levels
    const [currentLevel, setCurrentLevel] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [points, setPoints] = useState(0); // Initialize points state
    const location = useLocation();
    const { username, displayName, userImg } = location.state || {};

    const startCamera = () => {
        setCameraActive(true);
    };

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setGesture(data.gesture);
                        if (data.gesture === levels[currentLevel]) {
                            // Level completed, set to true
                            setLevelCompleted(true);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching gesture:', error);
                    });
            }, 100); 

            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLevel]);

    const nextLevel = () => {
        if (levelCompleted) {
            if (currentLevel < levels.length - 1) {
                const newPoints = points + 1; // Increase points by 1 when level is completed
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setPoints(newPoints);

                // Update the points in MongoDB
                fetch('http://127.0.0.1:5000/update-points', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        points: newPoints,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Points updated:', data);
                    })
                    .catch((error) => {
                        console.error('Error updating points:', error);
                    });
            } else {
                alert('Congratulations! You completed all levels.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Sign Language Gesture Recognition - Level {currentLevel + 1} (Sign: {levels[currentLevel]})
            </h1>

            {/* Display Points */}
            <div className="text-center mb-4">
                <p className="text-xl font-semibold text-gray-700">Points: {points}</p>
            </div>

            {!cameraActive ? (
                <div className="text-center mb-8">
                    <button 
                        onClick={startCamera}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Start Camera
                    </button>
                    <p className="mt-4 text-gray-600">Click to start the camera and recognition</p>
                </div>
            ) : (
                <Card className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Camera Feed */}
                        <div className="relative">
                            <img
                                src="http://127.0.0.1:5001/video_feed"
                                alt="Camera Feed"
                                className="w-[400px] h-[400px] rounded-lg object-cover"
                            />
                        </div>

                        {/* Gesture Display */}
                        <div className="text-center w-full">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                Detected Sign
                            </h2>
                            <div className="flex justify-center items-center h-24 w-24 mx-auto bg-gray-100 rounded-full">
                                <span className="text-4xl font-bold text-gray-800">
                                    {gesture === 'Nothing' ? '-' : gesture}
                                </span>
                            </div>
                        </div>

                        {/* Level Completion */}
                        {levelCompleted && (
                            <div className="text-center mt-6">
                                <p className="text-green-600 font-semibold">Correct! You signed {levels[currentLevel]}.</p>
                                <button 
                                    onClick={nextLevel}
                                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                                </button>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default Lesson;
