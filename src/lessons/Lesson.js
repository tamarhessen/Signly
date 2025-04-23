import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";

function Lesson() {
    const location = useLocation();
    const navigate = useNavigate();
    const [lives, setLives] = useState();
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
    const [showConfetti, setShowConfetti] = useState(false);

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
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [currentUsername, currentToken]);
    useEffect(() => {
        const fetchLives = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/users/lives/${currentUsername}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${currentToken}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setLives(data); // הנחת שיש שדה "lives" ב־response
                } else {
                    throw new Error('Failed to fetch lives');
                }
            } catch (error) {
                console.error('Error fetching lives:', error);
            }
        };
    
        fetchLives();
    }, [currentUsername, currentToken]); // תעשה את זה שוב אם המשתמש או הטוקן משתנים
    useEffect(() => {
        console.log('Lives:', lives);  // תוסיף כאן
        if (lives < 0 || isNaN(lives)) {
            setLives(0);  // תיקון אם מספר החיים לא תקין
        }
    }, [lives]);
    
    
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

                            setShowConfetti(true);
                            setTimeout(() => {
                                setShowConfetti(false);
                                setTimeout(() => setShowConfetti(true), 500);
                            }, 5000);
                        } else if (data.gesture !== 'Nothing') {
                            setLives(prev => {
                                const newLives = prev - 1;
                                if (newLives <= 0) {
                                    setIsOutOfLives(true);
                                    setCameraActive(false);
                                    setErrorMessage("💀 You're out of lives! Please try again later.");
                                } else {
                                    setErrorMessage(`❌ Incorrect! Try signing '${levels[currentLevel]}' again.`);
                                }
                                updateLives(newLives);

                                return newLives;
                            });
                            setCanTryAgain(false);
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLevel, canTryAgain, levelCompleted]);
    const updateLives = async (newLives) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/lose-life/${currentUsername}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
                body: JSON.stringify({ lives: newLives }),
            });
    
            if (res.ok) {
                console.log('Lives updated successfully');
            } else {
                throw new Error('Failed to update lives');
            }
        } catch (error) {
            console.error('Error updating lives:', error);
        }
    };

    const startCamera = () => {
        if (isOutOfLives) {
            setErrorMessage("💀 You're out of lives!");
            return;
        }
        setShowSignImage(false);
        setCameraActive(true);
        setErrorMessage("");
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
                setErrorMessage("");
            }

            navigate('/levels26', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, userPoints } });
        }
    };

    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Sign: {levels[currentLevel]}
                </h1>

                <div className="flex gap-4">
                    <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                        <p className="text-2xl font-semibold text-gray-700">Points:</p>
                        <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
                    </div>

                    <div className="flex items-center justify-center bg-white shadow-md rounded-lg p-4 text-center min-w-[180px] min-h-[100px]">
    <div className="flex items-center gap-2 text-[120px]">
        {Array.from({ length: lives }).map((_, i) => (
            <span key={i} className="text-red-500">❤️</span>
        ))}
        {Array.from({ length: 3 - lives }).map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">🤍</span>
        ))}
    </div>
</div>

                </div>

                {showSignImage ? (
                    <div className="text-center mb-8 flex flex-col items-center">
                        <img src={`/signs/${levels[currentLevel]}.png`} alt={`Sign for ${levels[currentLevel]}`} className="w-[400px] h-[400px] object-cover rounded-lg mb-6" />
                        <button onClick={startCamera} className="start-button">TRY IT YOURSELF</button>
                    </div>
                ) : cameraActive ? (
                    <div className="text-center mb-8 flex flex-col items-center">
                        <img src="http://127.0.0.1:5001/video_feed" alt="Camera Feed" className="w-[700px] h-[700px] rounded-lg object-cover" />
                        <div className="text-center w-full mt-4">
                            <div className="flex justify-center items-center h-24 w-24 mx-auto bg-gray-100 rounded-full">
                                <span className="text-4xl font-bold text-gray-800">{gesture === 'Nothing' ? '-' : gesture}</span>
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-center mt-6">
                                <p className="text-3xl text-red-600 font-semibold">{errorMessage}</p>
                                {!isOutOfLives && <button onClick={retryGesture} className="start-button">Try Again</button>}
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