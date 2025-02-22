import React, { useState, useEffect } from 'react';
import { Card } from '../components/card';
import './Lesson.css';

function Lesson() {
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);

    const startCamera = () => {
        setCameraActive(true);
    };

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                // Add the fetch request inside the interval
                fetch('http://127.0.0.1:5000/detect_gesture')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log('Received gesture data:', data); // Debugging output
                        setGesture(data.gesture);
                    })
                    .catch((error) => {
                        console.error('Error fetching gesture:', error);
                    });
            }, 100); // Polling every 100ms

            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [cameraActive]); // Effect depends on cameraActive state

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Sign Language Gesture Recognition
            </h1>

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
                        {/* Camera Feed Container */}
                        <div className="relative">
                            <img
                                src="http://127.0.0.1:5000/video_feed"
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
                    </div>
                </Card>
            )}
        </div>
    );
}

export default Lesson;
