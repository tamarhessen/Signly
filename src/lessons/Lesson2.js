import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';

function Lesson2() {
    
    const { word } = useParams(); // Get the word from URL parameter
    console.log("Current Word:", word);

    const levels = ['dad', 'dog', 'bat']; // Words in levels

    // Sign images for each word
    const signImages = {
        DAD: ['/signs/D.png', '/signs/A.png', '/signs/D.png'],
        CAT: ['/signs/C.png', '/signs/A.png', '/signs/T.png'],
        BAT: ['/signs/B.png', '/signs/A.png', '/signs/T.png'],
        // Add more word images if available
    };

    const location = useLocation();
    console.log("location", location.state);
    const navigate = useNavigate();
    const { userImg, username, displayName, token, points } = location.state || {};
    console.log("User:", username, displayName, userImg, token, points);

    // States for current level and word
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentWord, setCurrentWord] = useState(word ? word.toUpperCase() : levels[currentLevel].toUpperCase());
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0); // Current letter index
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [userPoints, setUserPoints] = useState(points || 0);
    const [showSignImage, setShowSignImage] = useState(true);
    const [correctLetters, setCorrectLetters] = useState(''); // Store correctly signed letters



    // Update currentWord and currentLevel when the URL word changes
    useEffect(() => {
        if (word) {
            setCurrentWord(word.toUpperCase());  // Update currentWord based on URL parameter
            setCurrentLevel(levels.indexOf(word.toLowerCase()));  // Update current level based on word
        }
    }, [word]); // Runs whenever the word in the URL changes

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);

                        // Check if the gesture matches the current part of the word
                        if (data.gesture === currentWord[currentLetterIndex]) {
                            // Update the correct letters when the gesture is correct
                            setCorrectLetters(prev => prev + currentWord[currentLetterIndex]);

                            // Move to the next letter if this one is correct
                            setCurrentLetterIndex(prevIndex => prevIndex + 1);
                        }

                        // Check if the whole word has been completed
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
        setShowSignImage(false); // Hide the image when camera starts
        setCameraActive(true);
    };

    const nextLevel = () => {
        if (levelCompleted) {
            const newPoints = userPoints + 1;
            console.log(`Moving to next word: ${currentWord}, New points: ${newPoints}`);

            if (currentLevel < levels.length - 1) {
                // Increment the level first, then set the new word
                setCurrentLevel(currentLevel + 1);
                setCurrentWord(levels[currentLevel + 1].toUpperCase()); // Set new word
                setCurrentLetterIndex(0); // Reset to first letter of new word
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
                setUserPoints(newPoints);
                setCorrectLetters(''); // Reset correct letters for the new word

                // Update points in the backend
                fetch('http://127.0.0.1:5000/update-points', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
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
            } else {
                console.log('Game completed! Total points:', userPoints);
                alert('Congratulations! You completed all levels.');
            }
        }
    };

    return (
        <>
            <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Sign: {currentWord.split('').map((letter, index) => (
                        <span key={index} className="text-lg font-bold">{letter} </span>
                    ))}
                </h1>

                {/* Display Points */}
                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-20xl font-semibold text-gray-700">Points:</p>
                    <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
                </div>

                {/* Display Sign Image */}
                {showSignImage ? (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img
                            src={signImages[currentWord]} // Dynamically display the correct sign image
                            alt={`Sign for ${currentWord}`}
                            className="w-[400px] h-[400px] object-cover rounded-lg mb-6"
                        />
                        <button
                            onClick={startCamera}
                            className="start-button"
                        >
                            TRY IT YOURSELF
                        </button>
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

                        {/* Show the correctly signed letters */}
                        <div className="mt-4">
                            <p className="text-xl font-semibold text-gray-700">
                                Signed so far: {correctLetters}
                            </p>
                        </div>

                        {levelCompleted && (
                            <div className="text-center mt-6">
                                <p className="text-6xl text-green-600 font-semibold flex items-center justify-center">
                                    ✅ Correct! You signed {levels[currentLevel]}.
                                </p>
                                <button
                                    onClick={nextLevel}
                                    className="start-button"
                                >
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

export default Lesson2;
