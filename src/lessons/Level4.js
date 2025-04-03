import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import './Level4.css';

function Level4() {
    const navigate = useNavigate();
      
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    console.log(currentPoints);
    console.log(currentUsername);

    const levels = [
        'Dad is here', 'The rocket flies', 'We love the jungle', 'Flowers in the garden', 'The castle is big',
        'Birds in the forest', 'A butterfly lands', 'The diamond shines', 'The sunshine is bright', 'A rainbow appears',
        'Climb the mountain', 'Friendship is strong', 'Use the computer', 'An elephant walks', 'The building is tall',
        'Fireworks explode', 'Pack the backpack', 'Find the treasure', 'Enjoy the vacation', 'Adventure awaits',
        'The airplane lands', 'It is my birthday', 'I love chocolate', 'A dinosaur roars', 'Join the festival', 'The lighthouse glows'
    ];
    
    const [userPoints, setUserPoints] = useState(currentPoints);

    // Calculate position (same as before, adjusted for the word size)
    const calculatePosition = (index) => {
        const angle = index * 0.5; // Adjust angle
        const radius = 150 + Math.pow(index, 1.5) * 2;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { transform: `translate(${x}px, ${y}px)` };
    };

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

            console.log("Response status:4", res.status);
            console.log("Current Token:", currentToken);

            if (res.ok) {
                const points = await res.text(); // API returns a plain number
                console.log("API Response4:", points);
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

    useEffect(() => {
        fetchData();
    }, []); // Runs once when the component loads
    
    console.log("points: ",userPoints);

    // Calculate the number of unlocked levels based on userPoints
    const unlockedLevels = userPoints + 1;

    return (
        <>
        <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />

            <div className="bg-white shadow-md rounded-lg p-4 w-32 text-center mb-6">
                <p className="text-2xl font-semibold text-gray-700">Points:</p>
                <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
            </div>

            <div className="levels-circle-wrapper relative">
                {levels.map((level, index) => (
                    <button
                        key={level}
                        onClick={() => navigate(`/lesson4/${level}`, { state: { word: level, currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } })}
                        className={`levels-button absolute p-4 text-xl font-bold w-20 h-20 rounded-full 
                            ${index < unlockedLevels ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
                        disabled={index+78 >= unlockedLevels}
                        style={calculatePosition(index)}
                    >
                        {level}
                    </button>
                ))}
            </div>
      
        <Footer />
        </>
    );
}

export default Level4;
