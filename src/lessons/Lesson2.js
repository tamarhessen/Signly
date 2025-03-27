import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';

function Lesson2() {
    const location = useLocation();
    const navigate = useNavigate();
    const {word, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    console.log("Current Word:", word);

    const levels = ['dad', 'dog', 'bat', 'rat', 'mat', 'hat', 'pat', 'sat', 'fat', 'vat', 
        'lap', 'map', 'tap', 'cap', 'nap', 'zap', 'lap', 'sap', 'gap', 'wrap', 
        'trap', 'flap', 'clap', 'slap', 'snap', 'stap'];

    // Sign images for each letter
    const signImages = {
        A: '/signs/A.png', B: '/signs/B.png', C: '/signs/C.png', D: '/signs/D.png', 
        E: '/signs/E.png', F: '/signs/F.png', G: '/signs/G.png', H: '/signs/H.png', 
        I: '/signs/I.png', J: '/signs/J.png', K: '/signs/K.png', L: '/signs/L.png', 
        M: '/signs/M.png', N: '/signs/N.png', O: '/signs/O.png', P: '/signs/P.png', 
        Q: '/signs/Q.png', R: '/signs/R.png', S: '/signs/S.png', T: '/signs/T.png', 
        U: '/signs/U.png', V: '/signs/V.png', W: '/signs/W.png', X: '/signs/X.png', 
        Y: '/signs/Y.png', Z: '/signs/Z.png'
    };

    console.log("location", location.state);
    console.log("User:", currentUsername, currentDisplayName, currentUserImg, currentToken, currentPoints);

    // States for current level and word
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentWord, setCurrentWord] = useState(word ? word.toUpperCase() : levels[currentLevel].toUpperCase());
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [userPoints, setUserPoints] = useState(currentPoints || 0);
    const [showSignImage, setShowSignImage] = useState(true);
    const [correctLetters, setCorrectLetters] = useState('');

    useEffect(() => {
        if (word) {
            setCurrentWord(word.toUpperCase());
            setCurrentLevel(levels.indexOf(word.toLowerCase()));
        }
    }, [word]);

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);
                        if (data.gesture === currentWord[currentLetterIndex]) {
                            setCorrectLetters(prev => prev + currentWord[currentLetterIndex]);
                            setCurrentLetterIndex(prevIndex => prevIndex + 1);
                        }
                        if (currentLetterIndex === currentWord.length) {
                            setLevelCompleted(true);
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
    };

    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Word: {currentWord.split('').map((letter, index) => (
                        <span key={index} className="text-lg font-bold">{letter} </span>
                    ))}
                </h1>
                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-20xl font-semibold text-gray-700">Points:</p>
                    <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
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
                        <img src="http://127.0.0.1:5001/video_feed" alt="Camera Feed" className="w-[700px] h-[700px] rounded-lg object-cover" />
                        <div className="text-center w-full mt-4">
                            <div className="flex justify-center items-center h-24 w-24 mx-auto bg-gray-100 rounded-full">
                                <span className="text-4xl font-bold text-gray-800">{gesture === 'Nothing' ? '-' : gesture}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-xl font-semibold text-gray-700">Signed so far: {correctLetters}</p>
                        </div>
                    </div>
                ) : null}
            </div>
            <Footer />
        </>
    );
}

export default Lesson2;