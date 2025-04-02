import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';

const levels = [
    'Dad is here', 'The rocket flies', 'We love the jungle', 'Flowers in the garden', 'The castle is big'
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
    const { word, currentUserImg, currentUsername, currentToken } = location.state || {};
    
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentSentence, setCurrentSentence] = useState(word || levels[currentLevel]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [completedWords, setCompletedWords] = useState([]);
    const [recognizedLetters, setRecognizedLetters] = useState([]);
    const [showSignImage, setShowSignImage] = useState(true);
    
    const words = currentSentence.split(' ');
    const currentWord = words[currentWordIndex];
    const letters = currentWord.split('');
    
    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        const detectedLetter = data.gesture.toLowerCase();
                        if (detectedLetter === letters[currentLetterIndex].toLowerCase()) {
                            setRecognizedLetters(prev => {
                                const updated = [...prev];
                                updated[currentLetterIndex] = true;
                                return updated;
                            });
                            setCurrentLetterIndex(prevIndex => prevIndex + 1);
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLetterIndex, currentWord]);

    const startCamera = () => {
        setShowSignImage(false);
        setCameraActive(true);
        setRecognizedLetters(new Array(letters.length).fill(false)); 
    };

    const nextWord = () => {
        if (currentWordIndex < words.length - 1) {
            setCompletedWords(prev => [...prev, currentWord]);
            setCurrentWordIndex(prev => prev + 1);
            setCurrentLetterIndex(0);
            setRecognizedLetters(new Array(words[currentWordIndex + 1].length).fill(false));
        }
    };

    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} navigate={navigate} token={currentToken} />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Sentence: {currentSentence}
                </h1>

                {/* הצגת כל התמונות בתחילה */}
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
                                            className="w-16 h-16 object-cover border border-gray-300 rounded-lg bg-white"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* כפתור להתחלת התרגול */}
                {!cameraActive && <button onClick={startCamera} className="start-button mt-4">TRY IT YOURSELF</button>}

                {/* תצוגת מצלמה */}
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

                {/* מילים שסיימנו */}
                <div className="mt-4">
                    <p className="font-semibold text-xl">Signed Until Here: {completedWords.join(', ')}</p>
                </div>

                {/* אינדיקציה לזיהוי כל אות */}
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

                {/* כפתור למילה הבאה - רק כשהמילה הושלמה */}
                {currentLetterIndex >= letters.length && (
                    <button onClick={nextWord} className="next-word-button mt-4">Next Word</button>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Lesson4;
