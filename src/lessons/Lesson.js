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
    const [hearts, setHearts] = useState(3); // Add hearts state
    const [isOutOfLives, setIsOutOfLives] = useState(false);
    const { letter, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints, isTraining } = location.state || {};
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
    const [requiredSigns, setRequiredSigns] = useState(3);
    const [isFirstSign, setIsFirstSign] = useState(true);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [helpLetter, setHelpLetter] = useState('');
    const helpDialogRef = useRef(null);

    // Training-specific states
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [totalTrainingLetters] = useState(5); // Complete 5 letters for training
    const [heartsEarned, setHeartsEarned] = useState(0);
    const [showHeartReward, setShowHeartReward] = useState(false);

    // Function to complete training
    const completeTraining = async () => {
        try {
            // Mark training as completed on backend
            const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/complete-training`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
            });
            
            if (res.ok) {
                // Award bonus hearts for completion
                const bonusHearts = 2;
                await updateHearts(hearts + bonusHearts);
                
                // Show completion message
                alert("🎉 Training Complete! You've earned bonus hearts and unlocked other levels!");
                
                // Navigate back to levels page
                navigate('/levels', { 
                    state: { 
                        currentUserImg, 
                        currentUsername, 
                        currentDisplayName, 
                        currentToken, 
                        currentPoints: userPoints 
                    } 
                });
            }
        } catch (error) {
            console.error("Error completing training:", error);
        }
    };

    // Function to update hearts
    const updateHearts = async (newHearts) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/lives/${currentUsername}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
                body: JSON.stringify({ hearts: Math.min(newHearts, 5) }), // Max 5 hearts
            });
            
            if (res.ok) {
                setHearts(Math.min(newHearts, 5));
            }
        } catch (error) {
            console.error("Error updating hearts:", error);
        }
    };

    // Award hearts for correct training answers
    const awardTrainingHeart = () => {
        if (isTraining && !showHeartReward) {
            setHeartsEarned(prev => prev + 1);
            setShowHeartReward(true);
            setTimeout(() => setShowHeartReward(false), 2000);
            updateHearts(hearts + 1);
        }
    };

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
    if (isTraining) {
        // For training mode, use only first 5 letters
        const trainingLetters = levels.slice(0, totalTrainingLetters);
        setPracticeLetters(trainingLetters);
        setRequiredSigns(totalTrainingLetters);
        setCurrentTargetLetter(trainingLetters[0]);
        setRemainingLetters(trainingLetters.slice(1));
    } else {
        // Normal level progression
        const lettersToLearn = levels.slice(0, currentLevel + 1);
        setPracticeLetters(lettersToLearn);
        setRequiredSigns(currentLevel + 1);
        setCurrentTargetLetter(levels[currentLevel]);
        setRemainingLetters(lettersToLearn.filter(l => l !== levels[currentLevel]));
    }
    setIsFirstSign(true);
}, [currentLevel, isTraining]);
    
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
        if (isOutOfLives && !isTraining) { // Don't show for training mode
            const showOutOfLivesDialog = async () => {
                await fetchTimeLeft();
                setShowDialog(true);
                const dialog = document.getElementById("outOfLivesDialog");
                if (dialog && typeof dialog.showModal === "function") {
                    dialog.showModal();
                }
            };
            showOutOfLivesDialog();
        }
    }, [isOutOfLives, isTraining]);

    // Fetch points and hearts from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch points
                const pointsRes = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${currentToken}`,
                    },
                });
                if (pointsRes.ok) {
                    const points = await pointsRes.text();
                    setUserPoints(Number(points));
                }

                // Fetch hearts
                const heartsRes = await fetch(`http://localhost:5000/api/users/lives/${currentUsername}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${currentToken}`,
                    },
                });
                if (heartsRes.ok) {
                    const heartsData = await heartsRes.text();
                    setHearts(Number(heartsData));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, [currentUsername, currentToken]);

    // Fetch initial lives count (only for non-training mode)
    useEffect(() => {
        if (!isTraining) {
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
                            fetchTimeLeft();
                        }
                    }
                } catch (error) {
                    console.error('Error fetching lives:', error);
                }
            };
            fetchLives();
        }
    }, [currentUsername, currentToken, isTraining]);

    // Handle lives validation
    useEffect(() => {
        if (!isTraining && (lives < 0 || isNaN(lives))) {
            setLives(0);
        }
    }, [lives, isTraining]);
    
    // Timer countdown for life regeneration (only for non-training mode)
    useEffect(() => {
        if (isTraining || timeLeft === null || timeLeft <= 0) return;
      
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
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
    }, [timeLeft, currentUsername, currentToken, isTraining]);
    
    // Format time for display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Gesture detection - Modified for training mode
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
                            setIsFirstSign(false);

                            // Award heart every 2 correct signs in training mode
                            if (isTraining && newCorrectCount % 2 === 0) {
                                awardTrainingHeart();
                            }

                            if (newCorrectCount >= requiredSigns) {
                                // Level/Training completed!
                                setLevelCompleted(true);
                                setCanTryAgain(false);
                                setShowConfetti(true);
                                setTimeout(() => {
                                    setShowConfetti(false);
                                    setTimeout(() => setShowConfetti(true), 500);
                                }, 5000);

                                // Complete training if in training mode
                                if (isTraining) {
                                    setTimeout(() => {
                                        completeTraining();
                                    }, 3000);
                                }
                            } else {
                                // Continue with next letter
                                setAwaitingContinue(true);
                                setCanTryAgain(false);
                            }

                        } else if (data.gesture !== 'Nothing') {
    // Incorrect sign
    setErrorMessage(`❌ Incorrect! Try signing '${currentTargetLetter}' again.`);
    setCanTryAgain(false);
}
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [cameraActive, currentTargetLetter, canTryAgain, levelCompleted, correctSignsCount, requiredSigns, isTraining]);

    // Update lives in the database (only for non-training mode)
    const updateLives = async (newLives) => {
        if (isTraining) return; // Don't update lives in training mode
        
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
                console.log('Lives updated successfully');
            } else {
                console.error(`Failed to update lives: ${res.status}`);
            }
        } catch (error) {
            console.error('Error updating lives:', error);
        }
    };

    // Start camera button handler
    const startCamera = () => {
        if (!isTraining && isOutOfLives) {
            setErrorMessage("💀 You're out of lives!");
            return;
        }
        setShowSignImage(false);
        setCameraActive(true);
        setErrorMessage("");
        setCorrectSignsCount(0);
        setIsFirstSign(true);
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
            
            // Give a point for completing level
            if (!isTraining && userPoints < currentLevel + 1) {
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

            // Give a heart for completing level (if less than 3)
            if (!isTraining && hearts < 3) {
                const newHearts = hearts + 1;
                try {
                    await updateHearts(newHearts);
                    setShowHeartReward(true);
                    setTimeout(() => setShowHeartReward(false), 2000);
                } catch (error) {
                    console.error('Error updating hearts:', error);
                }
            }

            if (!isTraining && currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
                setErrorMessage("");
                setCorrectSignsCount(0);
            }

            // Navigate back to levels
            const targetRoute = isTraining ? '/levels' : '/levels26';
            navigate(targetRoute, { 
                state: { 
                    currentUserImg, 
                    currentUsername, 
                    currentDisplayName, 
                    currentToken, 
                    currentPoints: userPoints 
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
      {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
          {showHeartReward && (
            <div className="heart-reward-animation">
              <span className="floating-heart">💖 +1 Heart!</span>
            </div>
          )}
          <div className="background-bll" style={{ backgroundImage: `url(/background.png)` }}/>
        
      
            <h1 className="lesson-title">
              {isTraining ? `🎓 Training - Sign: ${currentTargetLetter}` : `Level ${currentLevel + 1} - Sign: ${levels[currentLevel]}`}
            </h1>
      
            <div className="stats-container">
              <div className="points-box">
                <p className="points-label">Points:</p>
                <p className="points-value">{userPoints}</p>
              </div>
      
              {/* Show hearts for training mode, lives for normal mode */}
              {isTraining ? (
                <div className="hearts-box">
                  <p className="hearts-label">Hearts:</p>
                  <div className="hearts-display">
                    {Array.from({ length: hearts }).map((_, i) => (
                      <span key={i} className="heart">💖</span>
                    ))}
                  </div>
                </div>
              ) : (
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
              )}
            </div>
      
            {(userPoints>=26) && levelLocked ? (
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
                  src={`/signs/${isTraining ? currentTargetLetter : levels[currentLevel]}.png`}
                  alt={`Sign for ${isTraining ? currentTargetLetter : levels[currentLevel]}`}
                  className="sign-image"
                />
                {isTraining && (
                  <div className="training-info">
                    <p>🎓 Training Mode - Earn hearts as you learn!</p>
                    <p>Progress: {correctSignsCount}/{requiredSigns} letters completed</p>
                  </div>
                )}
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
                        <button 
                          className="help-btn"
                          onClick={() => openHelp(currentTargetLetter)}
                        >
                          Need Help? 📖
                        </button>
                      </div>

                      {/* Progress indicator */}
                      <div className="progress-bar-levels">
                        <p>Progress: {correctSignsCount}/{requiredSigns} {isTraining ? 'letters' : 'correct signs'}</p>
                        <div className="progress-bar-outer">
                          <div
                            className="progress-bar-inner"
                            style={{ width: `${(correctSignsCount / requiredSigns) * 100}%` }}
                          />
                        </div>
                      </div>

                      {isTraining && (
                        <div className="training-rewards">
                          <p>💖 Hearts earned: {heartsEarned}</p>
                          <p>🎯 Earn hearts every 2 correct signs!</p>
                        </div>
                      )}
                    </>
                  )}

                  {errorMessage && (
                    <div className="error-msg-box">
                      <p className="error-text">{errorMessage}</p>
                      {(isTraining || !isOutOfLives) && <button onClick={retryGesture} className="start-button">Try Again</button>}
                    </div>
                  )}
                  
                  {levelCompleted && (
                    <div className="success-msg-box">
                      <p className="success-text">
                        🎉 {isTraining ? 'Training Complete! You earned hearts and unlocked other levels!' : 'Level Complete! You mastered all the letters!'}
                      </p>
                      <button onClick={nextLevel} className="start-button">
                        {isTraining ? 'Complete Training' : (currentLevel < levels.length - 1 ? 'Next Level' : 'Finish')}
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
      


          {/* Help Modal */}
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