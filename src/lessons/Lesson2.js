import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";
import './Lesson.css';


const signImages = {
  A: '/signs/A.png', B: '/signs/B.png', C: '/signs/C.png', D: '/signs/D.png', 
  E: '/signs/E.png', F: '/signs/F.png', G: '/signs/G.png', H: '/signs/H.png', 
  I: '/signs/I.png', J: '/signs/J.png', K: '/signs/K.png', L: '/signs/L.png', 
  M: '/signs/M.png', N: '/signs/N.png', O: '/signs/O.png', P: '/signs/P.png', 
  Q: '/signs/Q.png', R: '/signs/R.png', S: '/signs/S.png', T: '/signs/T.png', 
  U: '/signs/U.png', V: '/signs/V.png', W: '/signs/W.png', X: '/signs/X.png', 
  Y: '/signs/Y.png', Z: '/signs/Z.png'
};

const levels = ['dad', 'dog', 'bat', 'rat', 'mat', 'hat', 'pat', 'sat', 'fat', 'vat', 
    'lap', 'map', 'tap', 'cap', 'nap', 'zap', 'sap', 'gap', 'wrap', 
    'trap', 'flap', 'clap', 'slap', 'snap', 'stap'];

function Lesson2() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log("location.state: ",location.state);
    const { word, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    console.log("word: " ,word);
    console.log("points3: " ,currentPoints);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
        const [errorMessage, setErrorMessage] = useState("");
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
    const [lives, setLives] = useState();
    const [isOutOfLives, setIsOutOfLives] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); // מצב לזיק
    const [canTryAgain, setCanTryAgain] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [levelLocked, setLevelLocked] = useState(false);
    const retryGesture = () => {
        setIncorrectLetter(false);
        setIsLocked(false); // Unlock when retrying
        setCanTryAgain(true);
    };
    
    const fetchTimeLeft = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/users/time-until-life/${currentUsername}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (typeof data.waitTime === 'number' && data.waitTime >= 0) {
                    setTimeLeft(data.waitTime);
                    return data.waitTime;
                } else {
                    setTimeLeft(0);
                    return 0;
                }
            } catch (err) {
                console.error('Failed to fetch time until next life:', err);
                return null;
            }
        };
    
        // Handle showing the out of lives dialog
        useEffect(() => {
            if (isOutOfLives) {
                const showOutOfLivesDialog = async () => {
                    // First fetch the latest time remaining
                    await fetchTimeLeft();
                    
                    // Then show the dialog
                    setShowDialog(true);
                    const dialog = document.getElementById("outOfLivesDialog");
                    if (dialog && typeof dialog.showModal === "function") {
                        dialog.showModal();
                    }
                };
                
                showOutOfLivesDialog();
            }
        }, [isOutOfLives]);
    
    useEffect(() => {
        if (word) {
            setCurrentWord(word.toUpperCase());
            setCurrentLevel(levels.indexOf(word.toLowerCase()));
        }
    }, [word]);
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
                        setLives(data);
                        if (data <= 0) {
                            setIsOutOfLives(true);
                            setLevelLocked(true);
                            fetchTimeLeft(); // Get time until next life
                        }

                        // הנחת שיש שדה "lives" ב־response
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
                useEffect(() => {
                    if (timeLeft === null || timeLeft <= 0) return;
                  
                    const interval = setInterval(() => {
                        setTimeLeft(prev => {
                            if (prev <= 1) {
                                clearInterval(interval);
                                // Check if lives have been replenished
                                const checkLives = async () => {
                                    try {
                                        const res = await fetch(`http://localhost:5000/api/users/lives/${currentUsername}`, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                authorization: `bearer ${currentToken}`,
                                            },
                                        });
                                        if (res.ok) {
                                            const data = await res.json();
                                            if (data > 0) {
                                                setLives(data);
                                                setIsOutOfLives(false);
                                                setLevelLocked(false);
                                            } else {
                                                // Still out of lives, fetch new time
                                                fetchTimeLeft();
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error checking lives:', error);
                                    }
                                };
                                checkLives();
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                  
                    return () => clearInterval(interval);
                }, [timeLeft, currentUsername, currentToken]);
                
                // Format time for display
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                };
                

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
                                    setIsLocked(true);
                                    setCanTryAgain(false);
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
            if (userPoints <= currentLevel + 26) {
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
    
            navigate('/level2', { 
                state: { 
                    currentUserImg, 
                    currentUsername, 
                    currentDisplayName, 
                    currentToken, 
                    currentPoints: userPoints > currentLevel + 26 ? userPoints : userPoints + 1 
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

            <div className="cc-container">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          <div className="background-bll" style={{ backgroundImage: `url(/background.png)` }}/>
        
      
            <h1 className="lesson-title">
                    Level {currentLevel + 1} - Word: {currentWord.split('').map((letter, index) => (
                        <span key={index} className="text-lg font-bold">{letter} </span>
                    ))}
                </h1>
                <div className="stats-container">
              <div className="points-box">
                <p className="points-label">Points:</p>
                <p className="points-value">{userPoints}</p>
              </div>
      
              <div className="lives-box">
                <div className="lives-icons">
                  {Array.from({ length: lives }).map((_, i) => (
                    <span key={i} className="heart">❤️</span>
                  ))}
                  {Array.from({ length: 3 - lives }).map((_, i) => (
                    <span key={`empty-${i}`} className="heart-empty">🤍</span>
                  ))}
                </div>
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
                                     className="sign-image"
                                />
                            ))}
                        </div>
                        <button onClick={startCamera} className="btn-primary">
                  TRY IT YOURSELF
                </button>
                    </div>
                ) : cameraActive ? (
                    <div className="camera-container">
                          <div className="left-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img 
                            src="http://127.0.0.1:5001/video_feed" 
                            alt="Camera Feed" 
                            className="camera-feed"
                        />
                        <div className="text-center w-full mt-4">
                        <div className="gesture-display">
                  <span className="gesture-text">{gesture === 'Nothing' ? '-' : gesture}</span>
                </div>
                </div>
                        </div>
                        
  <div className="right-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="mt-4">
<p className="signed-count">
   Signed so far: {correctLetters}
</p>
<p className="text-lg text-gray-600 sign-instruction">
  {isLocked ? "" : `Sign the letter: ${currentWord[currentLetterIndex] || ''}`}
</p>

                        </div>
                        {incorrectLetter && (
    <div className="error-msg-box">
    <p className="error-text">{errorMessage}</p>
    {!isOutOfLives && <button onClick={retryGesture} className="start-button">Try Again</button>}
  </div>
)}

                  
               
                {levelCompleted && (
                     <div className="success-msg-box">
                        <p className="success-text">
                            ✅ Correct! You signed {levels[currentLevel]}.
                        </p>
                        <button onClick={nextLevel} className="start-button">
                            {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                        </button>
                        
                    </div>
                )}
                </div>  
            </div> ) : null}
             </div>
            <dialog id="outOfLivesDialog" className="dialog-box">
            <h2 className="dialog-title">Out of Lives 💀</h2>
            <p className="dialog-msg">You've run out of lives. Please come back later or try a different level.</p>
            <form method="dialog">
              <button
                className="btn-primary"
                onClick={() => navigate("/home", {
                  state: {
                    username: currentUsername,
                    displayName: currentDisplayName,
                    userImg: currentUserImg,
                    token: currentToken
                  }
                })}
              >
                Go Home
              </button>
            </form>
          </dialog>
            <Footer />
        </>
    );
}

export default Lesson2;