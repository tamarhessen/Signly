import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';

function Lesson() {
    const location = useLocation();
    const navigate = useNavigate();
    const {letter, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    const levels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [currentLevel, setCurrentLevel] = useState(levels.indexOf(letter) || 0);
    console.log(location.state);  // בדוק אם זה מקבל את הערכים

   
        console.log(letter);
    
    const signImages = levels.reduce((acc, letter) => {
        acc[letter] = `/signs/${letter}.png`;
        return acc;
    }, {});

  
   
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    const [completedLevels, setCompletedLevels] = useState([]);
  
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [userPoints, setUserPoints] = useState(currentPoints || 0);
    const [showSignImage, setShowSignImage] = useState(true);
   
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

            console.log("Response status:", res.status);
            console.log("Current Token:", currentToken);


            if (res.ok) {
                const points = await res.text(); // API returns a plain number
                console.log("API Response:", points);
                setUserPoints(Number(points)); // Convert the response to a number
            } else {
                throw new Error('Failed to fetch points');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to increase points on the server and update the local state
    const increasePoints = async (additionalPoints) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                method: 'PUT', // Update points
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
                body: JSON.stringify({ points: userPoints + additionalPoints }), // Add additional points
            });

            if (res.ok) {
                const points = await res.text(); // API returns a plain number
                console.log("Updated points:", points);
                setUserPoints(Number(points)); // Convert the response to a number and update the state
            } else {
                throw new Error('Failed to update points');
            }
        } catch (error) {
            console.error("Error updating points:", error);
        }
    };

    useEffect(() => {
        // Retrieve user points from LocalStorage
        const storedPoints = localStorage.getItem('userPoints');
        if (storedPoints) {
            setUserPoints(parseInt(storedPoints, 10));
        }
    }, []);
    useEffect(() => {
        fetchData();
    }, []); // מריץ את הפונקציה רק פעם אחת כשהקומפוננטה נטענת

    const startCamera = () => {
        setShowSignImage(false);
        setCameraActive(true);
    };
    console.log("Completed Levels from state:", completedLevels);
    console.log("Current Level:", levels[currentLevel]);
    console.log("Already completed?", completedLevels.includes(levels[currentLevel]));
    

const nextLevel = () => {
    if (levelCompleted) {
        // בדוק אם השלב הזה כבר בוצע
        if (levelCompleted && userPoints < currentLevel + 1) {

            const newPoints = userPoints + 1;
            const newCompletedLevels = [...completedLevels, levels[currentLevel]];

            // עדכון ה-LocalStorage עם השלבים שהושלמו
            localStorage.setItem('completedLevels', JSON.stringify(newCompletedLevels));

            // עדכון ה-state של השלבים שהושלמו והנקודות
            setCompletedLevels(newCompletedLevels);
            setUserPoints(newPoints);

            // עדכון הנקודות בשרת
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
        } else {
            // הודעה למשתמש אם השלב כבר הושלם
            console.log('This level has already been completed!');
        }

        // מעבר לשלב הבא אם יש
        if (currentLevel < levels.length - 1) {
            setCurrentLevel(currentLevel + 1);
            setLevelCompleted(false);
            setCameraActive(false);
            setShowSignImage(true);
        }

        navigate('/levels26', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, userPoints } });
    }
};


    

    return (
        <>
            <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Sign: {levels[currentLevel]}
                </h1>

                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-2xl font-semibold text-gray-700">Points:</p>
                    <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
                </div>

                {showSignImage ? (
                    <div className="text-center mb-8 flex justify-center items-center">
                        <img 
                            src={signImages[levels[currentLevel]]} 
                            alt={`Sign for ${levels[currentLevel]}`} 
                            className="w-[400px] h-[400px] object-cover rounded-lg mb-6"
                        />
                        <button onClick={startCamera} className="start-button">
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
                                <button onClick={nextLevel} className="start-button">
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
