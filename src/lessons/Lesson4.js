import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";

const levels = [
    'Dad and mom', 'The rocket flies', 'We love the jungle', 'Flowers in the garden', 'The castle is big'
];

const signImages = {
    A: '/signs/A.png', B: '/signs/B.png', C: '/signs/C.png', D: '/signs/D.png',
    E: '/signs/E.png', F: '/signs/F.png', G: '/signs/G.png', H: '/signs/H.png',
    I: '/signs/I.png', J: '/signs/J.png', K: '/signs/K.png', L: '/signs/L.png',
    M: '/signs/M.png', N: '/signs/N.png', O: '/signs/O.png', P: '/signs/P.png',
    Q: '/signs/Q.png', R: '/signs/R.png', S: '/signs/S.png', T: '/signs/T.png',
    U: '/signs/U.png', V: '/signs/V.png', W: '/signs/W.png', X: '/signs/X.png',
    Y: '/signs/Y.png', Z: '/signs/Z.png'
};

function Lesson4() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        word, currentUserImg, currentUsername, currentDisplayName,
        currentToken, currentPoints
    } = location.state || {};

    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentSentence, setCurrentSentence] = useState(word || levels[currentLevel]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [completedWords, setCompletedWords] = useState([]);
    const [recognizedLetters, setRecognizedLetters] = useState([]);
    const [showSignImage, setShowSignImage] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [userPoints, setUserPoints] = useState(currentPoints || 0);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [correctLetters, setCorrectLetters] = useState('');
    const [incorrectLetter, setIncorrectLetter] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [canTryAgain, setCanTryAgain] = useState(true);
    const [wordCompleted, setWordCompleted] = useState(false);
    const [lives, setLives] = useState();
    const [isOutOfLives, setIsOutOfLives] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [levelLocked, setLevelLocked] = useState(false);
    
    // New states for second chance system
    const [showCorrectSignAnimation, setShowCorrectSignAnimation] = useState(false);
    const [isFirstMistake, setIsFirstMistake] = useState(true);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [lostLife, setLostLife] = useState(false);
    
    // Format time for display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };   
   // useEffect לעדכון השלב על בסיס המשפט
   useEffect(() => {
    if (word) {
        const levelIndex = levels.indexOf(word);
        if (levelIndex !== -1) {
            setCurrentLevel(levelIndex);
            setCurrentSentence(word);
            console.log(`Found sentence "${word}" at level index: ${levelIndex}`);
        } else {
            console.warn(`Sentence "${word}" not found in levels array`);
        }
    }
}, [word]);
    const words = currentSentence.split(' ');
    const currentWord = words[currentWordIndex];
    const letters = currentWord.split('');

    // Reset level to beginning
    const resetLevel = () => {
        setCurrentWordIndex(0);
        setCurrentLetterIndex(0);
        setCompletedWords([]);
        setRecognizedLetters([]);
        setCorrectLetters('');
        setIncorrectLetter(false);
        setIsLocked(false);
        setCanTryAgain(true);
        setWordCompleted(false);
        setLevelCompleted(false);
        setMistakeCount(0);
        setIsFirstMistake(true);
        setShowCorrectSignAnimation(false);
        setCameraActive(false);
        setShowSignImage(true);
        setLostLife(false);
        setErrorMessage('');
    };
 
    const retryGesture = () => {
        setIncorrectLetter(false);
        setIsLocked(false);
        setCanTryAgain(true);
        setShowCorrectSignAnimation(false);
        // Keep position - don't reset currentLetterIndex or currentWordIndex
        // This allows user to continue from the same letter they were on
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
        if (cameraActive && canTryAgain && !wordCompleted) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        const wordNow = words[currentWordIndex];
                        const letterNow = wordNow?.[currentLetterIndex];
                        const gestureLetter = data.gesture;

                        setGesture(gestureLetter);

                        const normalizedGesture = gestureLetter.toUpperCase();
                        const normalizedLetter = letterNow?.toUpperCase();

                        if (
                            normalizedGesture === normalizedLetter &&
                            !levelCompleted &&
                            !isLocked
                        ) {
                            setCorrectLetters(prev => prev + normalizedLetter);
                            setRecognizedLetters(prev => {
                                const updated = [...prev];
                                updated[currentLetterIndex] = true;
                                return updated;
                            });

                            // Reset mistake tracking for this letter
                            setMistakeCount(0);
                            setIsFirstMistake(true);

                            if (currentLetterIndex + 1 < wordNow.length) {
                                setCurrentLetterIndex(prev => prev + 1);
                            } else {
                                setWordCompleted(true);
                            }
                        } else if (
                            normalizedGesture !== 'NOTHING' &&
                            normalizedGesture !== normalizedLetter &&
                            (currentLetterIndex === 0 || normalizedGesture !== letters[currentLetterIndex - 1]?.toUpperCase())
                        ) {
                            // Handle mistake
                            if (isFirstMistake) {
                                // First mistake - show correct sign animation and continue from same position
                                setShowCorrectSignAnimation(true);
                                setIncorrectLetter(true);
                                setIsLocked(true);
                                setCanTryAgain(false);
                                setIsFirstMistake(false);
                                setMistakeCount(1);
                                setErrorMessage(`❌`);
                                // DON'T reset position - continue from same letter
                            } else {
                                // Second mistake - lose life and reset entire level from beginning
                                setLives(prev => {
                                    const newLives = prev - 1;
                                    if (newLives <= 0) {
                                        setIsOutOfLives(true);
                                        setCameraActive(false);
                                        setErrorMessage("💀 You're out of lives! Please try again later.");
                                    } else {
                                        setErrorMessage(`❤️ Life lost! Click below to restart level ${currentLevel + 1}.`);
                                        // Don't auto-reset - let user click button to restart
                                        setLostLife(true);
                                    }
                                    updateLives(newLives);
                                    return newLives;
                                });
                                setIncorrectLetter(true);
                                setIsLocked(true);
                                setCanTryAgain(false);
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [
        cameraActive,
        canTryAgain,
        currentLetterIndex,
        currentWordIndex,
        isLocked,
        levelCompleted,
        wordCompleted,
        letters,
        isFirstMistake
    ]);

    const startCamera = () => {
        if (isOutOfLives) {
            setErrorMessage("💀 You're out of lives!");
            return;
        }

        setShowSignImage(false);
        setCameraActive(true);
        setRecognizedLetters(new Array(letters.length).fill(false));
    };

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
        console.log('Lives:', lives);
        if (lives < 0 || isNaN(lives)) {
            setLives(0);
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

    const nextWord = () => {
        if (currentWordIndex < words.length - 1) {
            setCompletedWords(prev => [...prev, currentWord]);
            const nextWord = words[currentWordIndex + 1];
            setCurrentWordIndex(prev => prev + 1);
            setCurrentLetterIndex(0);
            setCorrectLetters('');
            setRecognizedLetters(new Array(nextWord.length).fill(false));
            setIncorrectLetter(false);
            setIsLocked(false);
            setCanTryAgain(true);
            setWordCompleted(false);
            // Reset mistake tracking for new word
            setMistakeCount(0);
            setIsFirstMistake(true);
            setShowCorrectSignAnimation(false);
        } else {
            // End of sentence
            setLevelCompleted(true);
            setShowConfetti(true);
        }
    };

    const nextLevel = () => {
        if (levelCompleted) {
            if (userPoints <= currentLevel + 78) {
                const newPoints = userPoints + 1;
                const newCompletedLevels = [...completedLevels, levels[currentLevel]];
                localStorage.setItem('completedLevels', JSON.stringify(newCompletedLevels));
                setCompletedLevels(newCompletedLevels);
                setUserPoints(newPoints);

                fetch('http://127.0.0.1:5000/update-points', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUsername, points: newPoints })
                })
                    .then(res => res.json())
                    .then(data => console.log('Points updated in MongoDB:', data))
                    .catch(err => console.error('Error updating points:', err));
            }

            if (currentLevel < levels.length - 1) {
                setCurrentLevel(prev => prev + 1);
                const newSentence = levels[currentLevel + 1];
                setCurrentSentence(newSentence);
                resetLevel(); // Use resetLevel function
            }

            navigate('/level4', {
                state: {
                    currentUserImg,
                    currentUsername,
                    currentDisplayName,
                    currentToken,
                    currentPoints: userPoints > currentLevel + 78 ? userPoints : userPoints + 1 
                }
            });
        }
    };
    console.log(currentLevel+"sss");
    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} navigate={navigate} token={currentToken} />
          
            <div className="cc-container">
                {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                <div className="background-bll" style={{ backgroundImage: `url(/background.png)` }}/>
        
                <h1 className="lesson-title">
                    Level {currentLevel + 1} - Sentence: {currentSentence}
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

                {showSignImage && (
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center space-x-2">
                            {words.map((word, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    {word.split('').map((letter, letterIndex) => (
                                        <img
                                            key={letterIndex}
                                            src={signImages[letter.toUpperCase()]}
                                            alt={`Sign for ${letter}`}
                                            className="sign-image"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              
                {lives > 0 && showSignImage && (
                    <button onClick={startCamera} className="btn-primary">
                        TRY IT YOURSELF
                    </button>
                )}
              
                {/* Camera section */}
                {cameraActive && (
                    <div className="camera-container">
                        {/* Left side with camera and gesture display */}
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
                        
                        {/* Right side with instructions and feedback */}
                        <div className="right-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="mt-4 word-progress-wrapper">
                                <p className="sign-instruction">
                                    {isLocked ? "" : `✍️ Sign the letter: ${currentWord[currentLetterIndex] || ''}`}
                                </p>

                                <p className="word-progress-title">Word Progress:</p>

                                <div className="word-progress-grid">
                                    {letters.map((letter, index) => (
                                        <div
                                            key={index}
                                            className={`word-letter-box ${recognizedLetters[index] ? 'correct' : 'incorrect'}`}
                                        >
                                            {letter.toUpperCase()} {recognizedLetters[index] ? '✔️' : '❌'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {incorrectLetter && !lostLife && (
                            <p className="error-text">{errorMessage}</p>
                            )}
                            {/* Show correct sign animation when user makes first mistake */}
                            {showCorrectSignAnimation && currentWord[currentLetterIndex] && (
                                <div className="correct-sign-animation" style={{
                                    border: '3px solid #4CAF50',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    margin: '20px 0',
                                    backgroundColor: '#E8F5E8',
                                    textAlign: 'center',
                                    animation: 'pulse 1s infinite'
                                }}>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                                        💡Watch how to sign {currentWord[currentLetterIndex].toUpperCase()}
                                    </p>
                                    <img
                                        src={signImages[currentWord[currentLetterIndex].toUpperCase()]}
                                        alt={`Correct sign for ${currentWord[currentLetterIndex]}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            border: '2px solid #4CAF50',
                                            borderRadius: '10px'
                                        }}
                                    />
                                    
                                </div>
                            )}

                            {/* Wrong Letter Message */}
                            {incorrectLetter && !lostLife && (
                                <div className="error-msg-box">
                                   
                                    {!isOutOfLives && mistakeCount === 1 && (
                                        <button onClick={retryGesture} className="start-button">
                                             🔄 Try Again (Second Chance)
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Lost Life Message - needs to restart level */}
                            {lostLife && !isOutOfLives && (
                                <div className="error-msg-box">
                               <p className="error-text" style={{ color: '#d32f2f' }}>
                               ❤️ Life lost! Click below to restart level {currentLevel + 1}
                                    </p>
                                    <button onClick={resetLevel} className="start-button" >
                                    Start Level Again
                                    </button>
                                </div>
                            )}

                            {/* Word Completed */}
                            {wordCompleted && !levelCompleted && (
                                <div className="success-msg-box">
                                    <p className="success-text">
                                        ✅ You finished the word "{currentWord}"!
                                    </p>
                                    <button onClick={nextWord} className="start-button mt-2">
                                        Next Word
                                    </button>
                                </div>
                            )}

                            {/* Level Completed */}
                            {levelCompleted && (
                                <div className="success-msg-box">
                                    <p className="success-text">
                                        ✅ Correct! You signed {levels[currentLevel]}.
                                    </p>
                                    <button onClick={nextLevel} className="start-button mt-4">
                                        {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <dialog id="outOfLivesDialog" className="dialog-box">
                <h2 className="dialog-title">Out of Lives 💀</h2>
                <p className="dialog-msg">You've run out of lives. Please come back later </p>
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

export default Lesson4;