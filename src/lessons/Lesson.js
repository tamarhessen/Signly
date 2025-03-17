import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import { useNavigate } from 'react-router-dom';


function Lesson({ userImg, username, displayName, token }) {
    const levels = ['L', 'A', 'B']; // סדר האותיות בשלבים
    const signImages = {
        L: '/signs/L.png',
        A: '/signs/A.png',
        B: '/signs/B.png'
    };

    const [currentLevel, setCurrentLevel] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [points, setPoints] = useState(0);
    const [showSignImage, setShowSignImage] = useState(true); // שליטה בהצגת התמונה

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);
                        if (data.gesture === levels[currentLevel]) {
                            setLevelCompleted(true);
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLevel]);

    const startCamera = () => {
        setShowSignImage(false); // הסתרת התמונה
        setCameraActive(true);
    };

    const nextLevel = () => {
        if (levelCompleted) {
            if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true); // הצגת תמונת הסימן הבא
                
                const newPoints = points + 1;
                setPoints(newPoints);

                // עדכון ניקוד בשרת
                fetch('http://127.0.0.1:5000/update-points', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, points: newPoints }),
                })
                .catch(error => console.error('Error updating points:', error));
            } else {
                alert('Congratulations! You completed all levels.');
            }
        }
    };

    return (
        <>
            <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Sign: {levels[currentLevel]}
                </h1>
    
                {/* הצגת הניקוד */}
                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-20xl font-semibold text-gray-700">Points:</p>
                    <p className="text-3xl font-bold text-blue-600">{points}</p>
                </div>
    
                {/* שלב הצגת התמונה */}
                {showSignImage ? (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img 
                            src={signImages[levels[currentLevel]]} 
                            alt={`Sign for ${levels[currentLevel]}`} 
                            className="w-[400px] h-[400px] object-cover rounded-lg mb-6"
                        />
                        <button 
                            onClick={startCamera}
                           className="start-button"
                        >
                            TRY IT YOURSELF
                        </button>
                    </div>
                ) : cameraActive ? (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img
                            src="http://127.0.0.1:5001/video_feed"
                            alt="Camera Feed"
                            className="w-[700px] h-[700px] rounded-lg object-cover"
                        />
                        <div className="text-center w-full mt-4">
                            <div className="flex justify-center items-center h-24 w-24 mx-auto bg-gray-100 rounded-full">
                                <span className="text-4xl font-bold text-gray-800">
                                    {gesture === 'Nothing' ? '-' : gesture}
                                </span>
                            </div>
                        </div>
    
                        {levelCompleted && (
                            <div className="text-center mt-6">
                                <p className="text-6xl text-green-600 font-semibold flex items-center justify-center">
                                    ✅ Correct! You signed {levels[currentLevel]}.
                                </p>
                                <button 
                                    onClick={nextLevel}
                                    className="start-button"
                                >
                                    {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
            <Footer />
        </>
    );
    
    
}

export default Lesson;
