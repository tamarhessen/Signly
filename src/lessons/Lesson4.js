import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";

const levels = [
    'Dad ca dac', 'The rocket flies', 'We love the jungle', 'Flowers in the garden', 'The castle is big'
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
      
        // Format time for display
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };   

    const words = currentSentence.split(' ');
    const currentWord = words[currentWordIndex];
    const letters = currentWord.split('');

    const retryGesture = () => {
        setIncorrectLetter(false);
        setIsLocked(false);
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
                            setIncorrectLetter(true);
                            setIsLocked(true);
                            setCanTryAgain(false);
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
        letters
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
                setCurrentWordIndex(0);
                setCurrentLetterIndex(0);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
                setCorrectLetters('');
                setIncorrectLetter(false);
                setIsLocked(false);
                setCanTryAgain(true);
                setRecognizedLetters([]);
                setCompletedWords([]);
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

    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} navigate={navigate} token={currentToken} />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Sentence: {currentSentence}
                </h1>
    
                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center mb-6">
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
                                            className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
              
            )}
              {lives > 0 && showSignImage && (
                <button onClick={startCamera} className="start-button mt-4">
                  TRY IT YOURSELF
                </button>
              )}
              
           
    
                {cameraActive && (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img src="http://127.0.0.1:5001/video_feed" alt="Camera Feed" className="w-[700px] h-[700px] rounded-lg object-cover" />
                        <div className="text-center w-full mt-4">
                            <div className="flex justify-center items-center h-24 w-24 mx-auto bg-gray-100 rounded-full">
                                <span className="text-4xl font-bold text-gray-800">
                                    {gesture === 'Nothing' ? '-' : gesture}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
    {cameraActive && (
              
                <div className="text-center mt-4">
    <p className={`font-semibold mt-2 ${isLocked ? 'text-red-600' : 'text-gray-800'}`} style={{ fontSize: '2rem' }}>
        {isLocked ? "Press 'Try Again' to continue" : `✍️ Sign the letter: ${currentWord[currentLetterIndex] || ''}`}
    </p>
</div>
)}

    
                {/* Wrong Letter Message */}
                {incorrectLetter && (
                    <div className="text-center mt-4">
                        <p className="text-red-600 text-2xl font-bold">❌ Wrong Sign! Try Again</p>
                        {!isOutOfLives && <button onClick={retryGesture} className="start-button">Try Again</button>}
                    </div>
                )}
      {cameraActive && (
               
                <div className="mt-6 text-center">
                    <p className="font-bold text-xl text-gray-700 mb-2">Word Progress:</p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-3 justify-center">
                        {letters.map((letter, index) => (
                            <div
                                key={index}
                                className={`px-3 py-2 rounded-xl text-xl font-semibold shadow-md ${
                                    recognizedLetters[index]
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-600'
                                }`}
                            >
                                {letter.toUpperCase()} {recognizedLetters[index] ? '✔️' : '❌'}
                            </div>
                        ))}
                    </div>
                </div>
                )}
    
                {/* Word Completed */}
                {wordCompleted && !levelCompleted && (
                    <div className="mt-6 text-center">
                        <p className="text-green-600 text-2xl font-bold">
                            ✅ You finished the word "{currentWord}"!
                        </p>
                        <button onClick={nextWord} className="start-button mt-2">
                            Next Word
                        </button>
                    </div>
                )}
            </div>
    
            {/* Level Completed */}
            {levelCompleted && (
                <div className="text-center mt-6">
                    <p className="text-5xl text-green-600 font-semibold flex items-center justify-center">
                        ✅ Correct! You signed {levels[currentLevel]}.
                    </p>
                    <button onClick={nextLevel} className="start-button mt-4">
                        {currentLevel < levels.length - 1 ? 'Next Level' : 'Finish'}
                    </button>
                </div>
            )}
                <dialog id="outOfLivesDialog" className="rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Out of Lives 💀</h2>
                <p className="text-sm mb-2">You've run out of lives. Please come back later or try a different level.</p>

                {showDialog && timeLeft !== null && (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
  Next life in: {formatTime(timeLeft)} ⏳
</p>

                )}

                <form method="dialog">
                    <button
                        className="bg-blue-600 text-pink px-4 py-2 rounded"
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
