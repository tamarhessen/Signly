import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';

const signImages = {
  A: '/signs/A.png', B: '/signs/B.png', C: '/signs/C.png', D: '/signs/D.png', 
  E: '/signs/E.png', F: '/signs/F.png', G: '/signs/G.png', H: '/signs/H.png', 
  I: '/signs/I.png', J: '/signs/J.png', K: '/signs/K.png', L: '/signs/L.png', 
  M: '/signs/M.png', N: '/signs/N.png', O: '/signs/O.png', P: '/signs/P.png', 
  Q: '/signs/Q.png', R: '/signs/R.png', S: '/signs/S.png', T: '/signs/T.png', 
  U: '/signs/U.png', V: '/signs/V.png', W: '/signs/W.png', X: '/signs/X.png', 
  Y: '/signs/Y.png', Z: '/signs/Z.png'
};

const levels = ['dad', 'dog', 'bat', 'rat', 'mat', 'hat', 'pat', 'sat', 'fat', 'vat', 
    'lap', 'map', 'tap', 'cap', 'nap', 'zap', 'sap', 'gap', 'wrap', 
    'trap', 'flap', 'clap', 'slap', 'snap', 'stap'];  // Removed one "nap"

function Lesson2() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log("location.state: ",location.state);  // בדוק אם זה מקבל את הערכים
    const { word, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    console.log("word: " ,word);
    console.log("points3: " ,currentPoints);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentWord, setCurrentWord] = useState(word ? word.toUpperCase() : levels[currentLevel].toUpperCase());
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [gesture, setGesture] = useState('Nothing');
    const [cameraActive, setCameraActive] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [userPoints, setUserPoints] = useState(currentPoints || 0);
    const [showSignImage, setShowSignImage] = useState(true);
    const [correctLetters, setCorrectLetters] = useState('');
    const [completedLevels, setCompletedLevels] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
        const [canTryAgain, setCanTryAgain] = useState(true);

    useEffect(() => {
        if (word) {
            setCurrentWord(word.toUpperCase());
            setCurrentLevel(levels.indexOf(word.toLowerCase()));
        }
    }, [word]);
    let i = 1;

    useEffect(() => {
        if (cameraActive) {
            const interval = setInterval(() => {
                fetch('http://127.0.0.1:5001/detect_gesture')
                    .then(response => response.json())
                    .then(data => {
                        setGesture(data.gesture);
    
                        // נבדוק אם האות כבר זוהתה בעזרת המערך של correctLetters
                        if (data.gesture === currentWord[currentLetterIndex] && !correctLetters.includes(currentWord[currentLetterIndex])) {
                            setCorrectLetters(prev => prev + currentWord[currentLetterIndex]);
                            setCurrentLetterIndex(prevIndex => prevIndex + 1);
                            setErrorMessage("");
    
                            // אם כל האותיות זוהו, נסיים את הרמה
                            if (currentLetterIndex === currentWord.length) {
                                setLevelCompleted(true);
                                setCanTryAgain(false);
                                setErrorMessage("");
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching gesture:', error));
            }, 100);
    
            return () => clearInterval(interval);
        }
    }, [cameraActive, currentLetterIndex, currentWord, correctLetters]);
    
    
   console.log(i);
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
 
             console.log("Response status:3", res.status);
             console.log("Current Token:", currentToken);
 
 
             if (res.ok) {
                 const points = await res.text(); // API returns a plain number
                 console.log("API Response3:", points);
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
         setErrorMessage("");
     };
     const retryGesture = () => {
        setErrorMessage("");
        setGesture("Nothing");
        setCanTryAgain(true);
    };
     console.log("Completed Levels from state:", completedLevels);
     console.log("Current Level:", levels[currentLevel]);
     console.log("Already completed?", completedLevels.includes(levels[currentLevel]));
     
 
     const nextLevel = () => {
        if (levelCompleted) {
            // Remove the restrictive points condition
            const newPoints = userPoints + 1;
            const newCompletedLevels = [...completedLevels, levels[currentLevel]];
    
            // Update LocalStorage with completed levels
            localStorage.setItem('completedLevels', JSON.stringify(newCompletedLevels));
    
            // Update state of completed levels and points
            setCompletedLevels(newCompletedLevels);
            setUserPoints(newPoints);
    
            // Update points on the server
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
    
            // Move to next level if possible
            if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setLevelCompleted(false);
                setCameraActive(false);
                setShowSignImage(true);
            }
    
            navigate('/level2', { 
                state: { 
                    currentUserImg, 
                    currentUsername, 
                    currentDisplayName, 
                    currentToken, 
                    userPoints: newPoints 
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
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Level {currentLevel + 1} - Word: {currentWord.split('').map((letter, index) => (
                        <span key={index} className="text-lg font-bold">{letter} </span>
                    ))}
                </h1>
                <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center">
                    <p className="text-2xl font-semibold text-gray-700">Points:</p>
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
                        <div className="mt-4">
                            <p className="text-xl font-semibold text-gray-700">
                                Signed so far: {correctLetters}
                            </p>
                        </div>
                    </div>
                ) : null}
                 {errorMessage && (
                            <div className="text-center mt-6">
                                <p className="text-3xl text-red-600 font-semibold">{errorMessage}</p>
                                <button onClick={retryGesture} className="start-button">Try Again</button>
                            </div>
                        )}
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
            <Footer />
        </>
    );
}

export default Lesson2;