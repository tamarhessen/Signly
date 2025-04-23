import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';

import Confetti from "react-confetti";

function Lesson() {
    const location = useLocation();
    const navigate = useNavigate();
    const [lives, setLives] = useState(3);
const [isOutOfLives, setIsOutOfLives] = useState(false);
    const { letter, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    
    const levels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const signImages = levels.reduce((acc, letter) => {
        acc[letter] = `/signs/${letter}.png`;
        return acc;
    }, {});
    const [currentLevel, setCurrentLevel] = useState(levels.indexOf(letter) || 0);
    const [userPoints, setUserPoints] = useState(0);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [showSignImage, setShowSignImage] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [canTryAgain, setCanTryAgain] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false); // מצב לזיקוקים
    const [hearts, setHearts] = useState(3);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${currentToken}`,
                    },
                });
                if (res.ok) {
                    const points = await res.text();
                    setUserPoints(Number(points));
                } else {
                    throw new Error('Failed to fetch points');
                }
    
                // נקבל את הלבבות
                const lifeRes = await fetch(`http://localhost:5000/lives/${currentUsername}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${currentToken}`,
                    },
                });
                if (lifeRes.ok) {
                    const livesLeft = await lifeRes.text();
                    setLives(Number(livesLeft));
                }
    
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [currentUsername, currentToken]);
    

    useEffect(() => {
        if (cameraActive && canTryAgain) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);
                        
                        if (data.gesture === levels[currentLevel]) {
                            setLevelCompleted(true);
                            setCanTryAgain(false);
                            setErrorMessage("");
                            setShowConfetti(true); // הצגת זיקוקים 🎉
                            setTimeout(() => setShowConfetti(false), 3000); // כיבוי לאחר 3 שניות
                        } else if (data.gesture !== 'Nothing') {
                            setErrorMessage(`❌ Incorrect! Try signing '${levels[currentLevel]}' again.`);
                            setCanTryAgain(false); 
                             // הורדת לב
    if (lives > 0) {
        const newLives = lives - 1;
        setLives(newLives);

        try {
             fetch('http://localhost:5000/time-until-life/${currentUsername}', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
                body: JSON.stringify({ username: currentUsername, lives: newLives }),
            });
        } catch (error) {
            console.error('Failed to update lives', error);
        }

        // נגמרו לבבות
        if (newLives === 0) {
            setIsOutOfLives(true);
            setCameraActive(false);
        }
    }
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);
    
            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLevel, canTryAgain, levelCompleted]);

    const startCamera = () => {
        setShowSignImage(false);
        setCameraActive(true);
        setErrorMessage(""); // Reset error message when starting
    };

    const retryGesture = () => {
        setErrorMessage("");
        setGesture("Nothing");
        setCanTryAgain(true);
    };
  

    const nextLevel = async () => {
        if (levelCompleted) {
            setCanTryAgain(false); 
            if (userPoints < currentLevel + 1) {
                const newPoints = userPoints + 1;
                setUserPoints(newPoints);

                try {
                    const res = await fetch('http://127.0.0.1:5000/update-points', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username: currentUsername, points: newPoints }),
                    });
                    if (!res.ok) throw new Error('Failed to update points');
                } catch (error) {
                    console.error('Error updating points:', error);
                }
            }

            if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
            }

            navigate('/levels26', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, userPoints } });
        }
    };

    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
            
            {/* זיקוקים גלובליים */}
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Level {currentLevel + 1} - Sign: {levels[currentLevel]}
                </h1>
    
                {/* תצוגת לבבות */}
                <div className="flex items-center mb-6">
                    {Array.from({ length: hearts }).map((_, idx) => (
                        <span key={idx} className="text-red-500 text-3xl mx-1">❤️</span>
                    ))}
                    {Array.from({ length: 3 - hearts }).map((_, idx) => (
                        <span key={idx} className="text-gray-400 text-3xl mx-1">🖤</span>
                    ))}
                </div>
    
                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-2xl font-semibold text-gray-700">Points:</p>
                    <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
                </div>
    
                {/* אם סיימנו את כל הלבבות */}
                {hearts === 0 ? (
                    <div className="mt-12 text-center">
                        <p className="text-4xl text-red-600 font-bold mb-6">😢 You've run out of hearts!</p>
                        <button onClick={() => {
                            setHearts(3);
                            setShowSignImage(true);
                            setCameraActive(false);
                            setErrorMessage('');
                        }} className="start-button">Try Again from This Level</button>
                    </div>
                ) : showSignImage ? (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img src={`/signs/${levels[currentLevel]}.png`} alt={`Sign for ${levels[currentLevel]}`} className="w-[400px] h-[400px] object-cover rounded-lg mb-6" />
                        <button onClick={startCamera} className="start-button">TRY IT YOURSELF</button>
                    </div>
                ) : cameraActive ? (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img src="http://127.0.0.1:5001/video_feed" alt="Camera Feed" className="w-[700px] h-[700px] rounded-lg object-cover" />
                        <div className="text-center w-full mt-4">
                            <div className="flex justify-center items-center h-24 w-24 mx-auto bg-gray-100 rounded-full">
                                <span className="text-4xl font-bold text-gray-800">{gesture === 'Nothing' ? '-' : gesture}</span>
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-center mt-6">
                                <p className="text-3xl text-red-600 font-semibold">{errorMessage}</p>
                                <button onClick={() => {
                                    setErrorMessage('');
                                    setHearts(prev => Math.max(0, prev - 1));
                                }} className="start-button">Try Again</button>
                            </div>
                        )}
                        {levelCompleted && (
                            <div className="text-center mt-6">
                                <p className="text-6xl text-green-600 font-semibold">✅ Correct! You signed {levels[currentLevel]}.</p>
                                <button onClick={nextLevel} className="start-button">
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