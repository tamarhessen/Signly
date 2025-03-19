import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import { useNavigate } from 'react-router-dom';

function Lesson() {
    const levels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; // Letters as levels
    const signImages = {
        A: '/signs/A.png',
        B: '/signs/B.png',
        C: '/signs/C.png',
        D: '/signs/D.png',
        E: '/signs/E.png',
        F: '/signs/F.png',
        G: '/signs/G.png',
        H: '/signs/H.png',
        I: '/signs/I.png',
        J: '/signs/J.png',
        K: '/signs/K.png',
        L: '/signs/L.png',
        M: '/signs/M.png',
        N: '/signs/N.png',
        O: '/signs/O.png',
        P: '/signs/P.png',
        Q: '/signs/Q.png',
        R: '/signs/R.png',
        S: '/signs/S.png',
        T: '/signs/T.png',
        U: '/signs/U.png',
        V: '/signs/V.png',
        W: '/signs/W.png',
        X: '/signs/X.png',
        Y: '/signs/Y.png',
        Z: '/signs/Z.png'
    };

    const location = useLocation();
    const { userImg, username, displayName, token, points } = location.state || {};

    const [currentLevel, setCurrentLevel] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [userPoints, setUserPoints] = useState(points || 0);
    const [showSignImage, setShowSignImage] = useState(true); // Control image display

    const navigate = useNavigate();

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);
                        if (data.gesture === levels[currentLevel]) {
                            setLevelCompleted(true);
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLevel]);

    const startCamera = () => {
        setShowSignImage(false); // Hide the image when camera starts
        setCameraActive(true);
    };

    const nextLevel = () => {
        if (levelCompleted) {
            // Increase points when the level is completed
            const newPoints = userPoints + 1;
            console.log(`Moving to next level: ${currentLevel + 1}, New points: ${newPoints}`);
            
            if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
                setUserPoints(newPoints);  // Update user points
                
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
                    Level {currentLevel + 1} - Sign: {levels[currentLevel]}
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
                            src={signImages[levels[currentLevel]]} 
                            alt={`Sign for ${levels[currentLevel]}`} 
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

export default Lesson;
