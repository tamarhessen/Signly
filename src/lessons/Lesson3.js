import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";

const signImages = {
  A: '/signs/A.png', B: '/signs/B.png', C: '/signs/C.png', D: '/signs/D.png', 
  E: '/signs/E.png', F: '/signs/F.png', G: '/signs/G.png', H: '/signs/H.png', 
  I: '/signs/I.png', J: '/signs/J.png', K: '/signs/K.png', L: '/signs/L.png', 
  M: '/signs/M.png', N: '/signs/N.png', O: '/signs/O.png', P: '/signs/P.png', 
  Q: '/signs/Q.png', R: '/signs/R.png', S: '/signs/S.png', T: '/signs/T.png', 
  U: '/signs/U.png', V: '/signs/V.png', W: '/signs/W.png', X: '/signs/X.png', 
  Y: '/signs/Y.png', Z: '/signs/Z.png'
};
const levels = [
    'daddy', 'rocket', 'jungle', 'garden', 'castle', 'forest', 'butterfly', 'diamond', 'sunshine', 'rainbow',
    'mountain', 'friendship', 'computer', 'elephant', 'building', 'fireworks', 'backpack', 'treasure', 'vacation',
    'adventure', 'airplane', 'birthday', 'chocolate', 'dinosaur', 'festival', 'lighthouse'
];

function Lesson3() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log("location.state: ",location.state);
    const { word, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    console.log("word: " ,word);
    console.log("points3: " ,currentPoints);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentWord, setCurrentWord] = useState(word ? word.toUpperCase() : levels[currentLevel].toUpperCase());
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [userPoints, setUserPoints] = useState(currentPoints || 0);
    const [showSignImage, setShowSignImage] = useState(true);
    const [correctLetters, setCorrectLetters] = useState('');
    const [completedLevels, setCompletedLevels] = useState([]);
    const [incorrectLetter, setIncorrectLetter] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
     const [showConfetti, setShowConfetti] = useState(false); // מצב לזיק
         const [canTryAgain, setCanTryAgain] = useState(true);
      const [lives, setLives] = useState();
        const [isOutOfLives, setIsOutOfLives] = useState(false);
    
    const retryGesture = () => {
        setIncorrectLetter(false);
        setIsLocked(false); // Unlock when retrying
        setCanTryAgain(true);
    };
    

    useEffect(() => {
        if (word) {
            setCurrentWord(word.toUpperCase());
            setCurrentLevel(levels.indexOf(word.toLowerCase()));
        }
    }, [word]);

    useEffect(() => {
        if (cameraActive && canTryAgain) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        if (!levelCompleted) { // 👈 זה התנאי החדש
                            setGesture(data.gesture);
    
                            if (!isLocked) {
                                if (data.gesture === currentWord[currentLetterIndex]) {
                                    setCorrectLetters(prev => prev + currentWord[currentLetterIndex]);
                                    setCurrentLetterIndex(prevIndex => prevIndex + 1);
                                } else if (data.gesture !== 'Nothing' && data.gesture !== currentWord[currentLetterIndex - 1]) {
                                    setIncorrectLetter(true);
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
                                    setIsLocked(true);
                                    setCanTryAgain(false);
                                }
                            }
    
                            if (currentLetterIndex === currentWord.length) {
                                setLevelCompleted(true);
                                setShowConfetti(true);
    
                                setTimeout(() => {
                                    setShowConfetti(false);
                                    setTimeout(() => setShowConfetti(true), 500);
                                }, 5000);
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);
    
            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLetterIndex, canTryAgain, currentWord, isLocked, levelCompleted]);
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
            }, [currentUsername, currentToken]);
               useEffect(() => {
                    console.log('Lives:', lives);  // תוסיף כאן
                    if (lives < 0 || isNaN(lives)) {
                        setLives(0);  // תיקון אם מספר החיים לא תקין
                    }
                }, [lives]);
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
    const fetchData = async () => {
        try {
            console.log("Fetching points for user:", currentUsername);

            const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
            });

            console.log("Response status:3", res.status);
            console.log("Current Token:", currentToken);

            if (res.ok) {
                const points = await res.text();
                console.log("API Response3:", points);
                setUserPoints(Number(points));
            } else {
                throw new Error('Failed to fetch points');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const increasePoints = async (additionalPoints) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
                body: JSON.stringify({ points: userPoints + additionalPoints }),
            });

            if (res.ok) {
                const points = await res.text();
                console.log("Updated points:", points);
                setUserPoints(Number(points));
            } else {
                throw new Error('Failed to update points');
            }
        } catch (error) {
            console.error("Error updating points:", error);
        }
    };
    useEffect(() => {
        const storedPoints = localStorage.getItem('userPoints');
        if (storedPoints) {
            setUserPoints(parseInt(storedPoints, 10));
        }
    }, []);
    
    useEffect(() => {
        fetchData();
    }, []);

    const startCamera = () => {
        if (isOutOfLives) {
            setErrorMessage("💀 You're out of lives!");
            return;
        }
        setShowSignImage(false);
        setCameraActive(true);
    };
    console.log("wwwww", currentLevel)
    console.log("Completed Levels from state:", completedLevels);
    console.log("Current Level:", levels[currentLevel]);
    console.log("Already completed?", completedLevels.includes(levels[currentLevel]));
    
    const nextLevel = () => {
        setCanTryAgain(false);
        if (levelCompleted) {
    
            // בדיקה אם המשתמש כבר סיים את השלב הזה
            if (userPoints <= currentLevel + 52) {
                const newPoints = userPoints + 1;
                const newCompletedLevels = [...completedLevels, levels[currentLevel]];
                localStorage.setItem('completedLevels', JSON.stringify(newCompletedLevels));
                setCompletedLevels(newCompletedLevels);
                setUserPoints(newPoints);
                
                fetch('http://127.0.0.1:5000/update-points', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: currentUsername,
                        points: newPoints,
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Points updated in MongoDB:', data);
                })
                .catch((error) => {
                    console.error('Error updating points:', error);
                });
            }
    
            if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
                setCurrentLetterIndex(0);
                setCorrectLetters('');
                setIncorrectLetter(false);
                setIsLocked(false);
            }
    
            navigate('/level3', { 
                state: { 
                    currentUserImg, 
                    currentUsername, 
                    currentDisplayName, 
                    currentToken, 
                    currentPoints: userPoints > currentLevel + 52 ? userPoints : userPoints + 1 
                } 
            });
        }
    };
    

    return (
        <>
            <TopPanel 
                userImg={currentUserImg} 
                username={currentUsername} 
                displayName={currentDisplayName} 
                navigate={navigate} 
                token={currentToken} 
            />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Word: {currentWord.split('').map((letter, index) => (
                        <span key={index} className="text-lg font-bold">{letter} </span>
                    ))}
                </h1>
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
                {showSignImage ? (
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center space-x-2">
                            {currentWord.split('').map((letter, index) => (
                                <img
                                    key={index}
                                    src={signImages[letter]}
                                    alt={`Sign for ${letter}`}
                                    className="w-40 h-40 object-cover border border-gray-300 rounded-lg bg-white"
                                />
                            ))}
                        </div>
                        <button onClick={startCamera} className="start-button mt-4">TRY IT YOURSELF</button>
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
                        <div className="mt-4">
                            <p className="text-xl font-semibold text-gray-700" style={{ fontSize: '2rem' }}>
                                Signed so far: {correctLetters}
                            </p>
                            <p className="text-lg text-gray-600" style={{ fontSize: '2rem' }}>
    {isLocked ?  "": `Sign the letter: ${currentWord[currentLetterIndex] || ''}`}
</p>

                        </div>
                        {incorrectLetter && (
                            <div className="text-center mt-4" >
                                <p className="text-red-600 text-2xl font-bold" style={{ fontSize: '2rem' }}>❌ Wrong Sign! Try Again</p>
                                {!isOutOfLives && <button onClick={retryGesture} className="start-button">Try Again</button>}
                            </div>
                        )}
                    </div>
                ) : null}
                {levelCompleted && (
                    <div className="text-center mt-6">
                        <p className="text-6xl text-green-600 font-semibold flex items-center justify-center">
                            ✅ Correct! You signed {levels[currentLevel]}.
                        </p>
                        <button onClick={nextLevel} className="start-button">
                            {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Lesson3;