import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";
import './Lesson.css';

function Lesson() {
    
    const location = useLocation();
    const navigate = useNavigate();
    const [lives, setLives] = useState();
    const [isOutOfLives, setIsOutOfLives] = useState(false);
    const { letter, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    const [remainingLetters, setRemainingLetters] = useState([]);
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
    const [timeLeft, setTimeLeft] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [levelLocked, setLevelLocked] = useState(false);
    const [awaitingContinue, setAwaitingContinue] = useState(false);
    
    // New state for cumulative learning
    const [currentTargetLetter, setCurrentTargetLetter] = useState('');
    const [practiceLetters, setPracticeLetters] = useState([]);
    const [correctSignsCount, setCorrectSignsCount] = useState(0);
    const [requiredSigns, setRequiredSigns] = useState(3); // Number of correct signs needed to complete level
    const [isFirstSign, setIsFirstSign] = useState(true); // Track if this is the first sign of the level
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [helpLetter, setHelpLetter] = useState('');
    const helpDialogRef = useRef(null);

const handleContinue = () => {
    // Remove the current letter from remainingLetters
    setRemainingLetters(prev => {
        const updated = prev.filter(l => l !== currentTargetLetter);
        // Pick next letter from updated list
        const nextLetter = updated.length > 0 ? updated[Math.floor(Math.random() * updated.length)] : '';
        setCurrentTargetLetter(nextLetter);
        setCanTryAgain(true);
        setAwaitingContinue(false);
        return updated;
    });
};
    
    // Generate practice letters for current level (all letters up to current level)
useEffect(() => {
    const lettersToLearn = levels.slice(0, currentLevel + 1);
    setPracticeLetters(lettersToLearn);

    // Set required signs to match the level (A=1, B=2, C=3, etc.)
    setRequiredSigns(currentLevel + 1);

    // Always start with the current level's letter (the new letter they're learning)
    setCurrentTargetLetter(levels[currentLevel]);
    setIsFirstSign(true);

    // Initialize remaining letters (excluding the first one, which is shown first)
    setRemainingLetters(lettersToLearn.filter(l => l !== levels[currentLevel]));
}, [currentLevel]);
    
    // Function to get next random letter
const getNextRandomLetter = () => {
    if (remainingLetters.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * remainingLetters.length);
    return remainingLetters[randomIndex];
};
    
    // Open the dialog when showHelpModal is true
    useEffect(() => {
        if (showHelpModal && helpDialogRef.current) {
            helpDialogRef.current.showModal();
        } else if (!showHelpModal && helpDialogRef.current) {
            helpDialogRef.current.close();
        }
    }, [showHelpModal]);

    const openHelp = (letter) => {
        setHelpLetter(letter);
        setShowHelpModal(true);
    };

    const closeHelp = () => {
        setShowHelpModal(false);
        setHelpLetter('');
    };
    
    // Fetch time left for life regeneration
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

    // Fetch points from the API
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

    // Fetch initial lives count
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
                    
                    // Check if user is out of lives on initial load
                    if (data <= 0) {
                        setIsOutOfLives(true);
                        setLevelLocked(true);
                        fetchTimeLeft(); // Get time until next life
                    }
                } else {
                    throw new Error('Failed to fetch lives');
                }
            } catch (error) {
                console.error('Error fetching lives:', error);
            }
        };
    
        fetchLives();
    }, [currentUsername, currentToken]);

    // Handle lives validation
    useEffect(() => {
        console.log('Lives:', lives);
        if (lives < 0 || isNaN(lives)) {
            setLives(0);
        }
    }, [lives]);
    
    // Timer countdown for life regeneration
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
    
    // Gesture detection - Modified for cumulative learning
    useEffect(() => {
        if (cameraActive && canTryAgain) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);

if (data.gesture === currentTargetLetter) {
    // Correct sign!
    const newCorrectCount = correctSignsCount + 1;
    setCorrectSignsCount(newCorrectCount);
    setErrorMessage("");
    setIsFirstSign(false); // No longer the first sign

    if (newCorrectCount >= requiredSigns) {
        // Level completed!
        setLevelCompleted(true);
        setCanTryAgain(false);
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
            setTimeout(() => setShowConfetti(true), 500);
        }, 5000);
    } else {
        // Pause and show Continue button
        setAwaitingContinue(true);
        setCanTryAgain(false);
    }

                        } else if (data.gesture !== 'Nothing') {
                            setLives(prev => {
                                const newLives = prev - 1;
                                if (newLives <= 0) {
                                    setIsOutOfLives(true);
                                    setCameraActive(false);
                                    setErrorMessage("💀 You're out of lives! Please try again later.");
                                } else {
                                    setErrorMessage(`❌ Incorrect! Try signing '${currentTargetLetter}' again.`);
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
    }, [cameraActive, currentTargetLetter, canTryAgain, levelCompleted, correctSignsCount, requiredSigns]);

    // Update lives in the database
    const updateLives = async (newLives) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/lose-life/${currentUsername}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${currentToken}`,
                },
                body: JSON.stringify({ lives: newLives }),
            });
        
            if (res.ok) {
                console.log('Lives updated successfully:');
            } else {
                console.error(`Failed to update lives: ${res.status}`);
            }
        } catch (error) {
            console.error('Error updating lives:', error);
        }
    };

    // Start camera button handler
    const startCamera = () => {
        if (isOutOfLives) {
            setErrorMessage("💀 You're out of lives!");
            return;
        }
        setShowSignImage(false);
        setCameraActive(true);
        setErrorMessage("");
        setCorrectSignsCount(0); // Reset progress
        setIsFirstSign(true); // Reset to first sign
    };

    // Retry gesture button handler
    const retryGesture = () => {
        setErrorMessage("");
        setGesture("Nothing");
        setCanTryAgain(true);
    };

    // Next level button handler
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
                setCorrectSignsCount(0);
            }

            navigate('/levels26', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, userPoints } });
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
      {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
          <div className="background-bll" style={{ backgroundImage: `url(/background.png)` }}/>
        
      
            <h1 className="lesson-title">
              Level {currentLevel + 1} - Sign: {levels[currentLevel]}
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
      
            {levelLocked ? (
              <div className="locked-level-container">
                <div className="locked-box">
                  <h2 className="locked-title">Level Locked 🔒</h2>
                  <p className="locked-msg">
                    You're out of lives! You need at least one heart to attempt this level.
                  </p>
      

      

                </div>
              </div>
            ) : showSignImage ? (
              <div className="sign-preview-container">
                <img
                  src={`/signs/${levels[currentLevel]}.png`}
                  alt={`Sign for ${levels[currentLevel]}`}
                  className="sign-image"
                />
                <button onClick={startCamera} className="btn-primary">
                  TRY IT YOURSELF
                </button>
              </div>
            ) : cameraActive ? (
              <div className="camera-container">
             
               
                {/* Left side - Camera and detected gesture */}
                <div className="left-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src="http://127.0.0.1:5001/video_feed"
                    alt="Camera Feed"
                    className="camera-feed"
                  />
                  <div className="gesture-display">
                    <span className="gesture-text">{gesture === 'Nothing' ? '-' : gesture}</span>
                  </div>
                </div>

                {/* Right side - Messages and buttons */}
                <div className="right-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 {!levelCompleted && (
  <>
    {/* Current target and help button */}
    <div className="current-target">
      <h2>Sign the letter: <span className="target-letter">{currentTargetLetter}</span></h2>

      {/* Help button for current target letter */}
      <button 
        className="help-btn"
        onClick={() => openHelp(currentTargetLetter)}
      >
        Need Help? 📖
      </button>
    </div>

    {/* Progress indicator */}
    <div className="progress-bar-levels">
      <p>Progress: {correctSignsCount}/{requiredSigns} correct signs</p>
      <div className="progress-bar-outer">
        <div
          className="progress-bar-inner"
          style={{ width: `${(correctSignsCount / requiredSigns) * 100}%` }}
        />
      </div>
    </div>
  </>
)}


                  {errorMessage && (
                    <div className="error-msg-box">
                      <p className="error-text">{errorMessage}</p>
                      {!isOutOfLives && <button onClick={retryGesture} className="start-button">Try Again</button>}
                    </div>
                  )}
                  {levelCompleted && (
                    <div className="success-msg-box">
                      <p className="success-text">🎉 Level Complete! You mastered all the letters!</p>
                      <button onClick={nextLevel} className="start-button">
                        {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                      </button>
                    </div>
                  )}
                  {awaitingContinue && !levelCompleted && (
  <div className="continue-box">
    <p className="success-text">✅ Correct! Well done.</p>
    <button className="btn-primary" onClick={handleContinue}>
      Continue
    </button>
  </div>
)}
                </div>
              </div>
            ) : null}
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

          {/* Help Modal as a dialog */}
          <dialog ref={helpDialogRef} className="help-dialog" onClose={closeHelp}>
            <div className="help-modal-header">
                <h3>How to sign: {helpLetter}</h3>
                <button className="close-help-btn" onClick={closeHelp}>×</button>
            </div>
            <div className="help-modal-content">
                <img
                    src={`/signs/${helpLetter}.png`}
                    alt={`Sign for ${helpLetter}`}
                    className="help-sign-image"
                />
            </div>
          </dialog>
      
          <Footer />
        </>
      );
      
   
}

export default Lesson;