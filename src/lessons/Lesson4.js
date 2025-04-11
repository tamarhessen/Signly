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
    const [showConfetti, setShowConfetti] = useState(false);
    const [userPoints, setUserPoints] = useState(currentPoints || 0);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [correctLetters, setCorrectLetters] = useState('');
    const [incorrectLetter, setIncorrectLetter] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [canTryAgain, setCanTryAgain] = useState(true);
    const [wordCompleted, setWordCompleted] = useState(false);


    const words = currentSentence.split(' ');
    const currentWord = words[currentWordIndex];
    const letters = currentWord.split('');

    const retryGesture = () => {
        setIncorrectLetter(false);
        setIsLocked(false);
        setCanTryAgain(true);
    };

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
        setShowSignImage(false);
        setCameraActive(true);
        setRecognizedLetters(new Array(letters.length).fill(false));
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
                    currentPoints: newPoints
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

                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-2xl font-semibold text-gray-700">Points:</p>
                    <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
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
                                            className="w-16 h-16 object-cover border border-gray-300 rounded-lg bg-pink"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!cameraActive && <button onClick={startCamera} className="start-button mt-4">TRY IT YOURSELF</button>}

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

                <div className="mt-4">
                    <p className="font-semibold text-xl">Signed so far: {completedWords.join(', ')}</p>
                    <p className="text-lg text-gray-600">
                        {isLocked ? "Press 'Try Again' to continue" : `Sign the letter: ${currentWord[currentLetterIndex] || ''}`}
                    </p>
                </div>

                {incorrectLetter && (
    <div className="text-center mt-4">
        <p className="text-red-600 text-2xl font-bold">❌ Wrong Sign! Try Again</p>
        <button onClick={retryGesture} className="mt-2 bg-red-500 text-pink px-4 py-2 rounded-lg">
            Try Again
        </button>
    </div>
)}


                <div className="mt-4">
                    <p className="font-semibold text-xl">Word Progress:</p>
                    <div className="flex justify-center space-x-2">
                        {letters.map((letter, index) => (
                            <span key={index} className={`text-2xl font-bold ${recognizedLetters[index] ? 'text-green-500' : 'text-red-500'}`}>
                                {letter} {recognizedLetters[index] ? '✔️' : '❌'}
                            </span>
                        ))}
                    </div>
                </div>

                {wordCompleted && !levelCompleted && (
    <div className="mt-4">
        <p className="text-green-600 text-2xl font-bold">✅ You finished the word "{currentWord}"!</p>
        <button onClick={nextWord} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
            Next Word
        </button>
    </div>
)}
            </div> 

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

            <Footer />
        </>
    );
}

export default Lesson4;
