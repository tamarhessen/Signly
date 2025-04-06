import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './levelsPage.css';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Levels from './Levels.js';

function LevelsPage() {
    const location = useLocation();
   
    const {  currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};


    const [userPoints, setUserPoints] = useState(currentPoints);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Levels array to represent levels from 1 to 6
    const levels = [
        { level: 1, requiredPoints: 0 },
        { level: 2, requiredPoints: 26 },
        { level: 3, requiredPoints: 52 },
        { level: 4, requiredPoints: 78 },

    ];

    // Function to fetch points from the server
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

            console.log("Response status:7", res.status);
            console.log("Current Token:", currentToken);


            if (res.ok) {
                const points = await res.text(); // API returns a plain number
                console.log("API Response11:", points);
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

    // Fetch points when the component is mounted
    useEffect(() => {
        fetchData();
    }, [currentUsername, currentToken]); // Dependency array to fetch when username or token changes
    console.log(currentUsername+"ddd");
    const navigateToLevel = (level) => {
        if (level.level === 1) {
            
            navigate('/levels26', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } });

        }
        else if (level.level === 2) {
            
            navigate('/level2', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } });

        } 
        else if (level.level === 3) {
            
            navigate('/level3', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } });

        }
        else if (level.level === 4) {
            
            navigate('/level4', { state: { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } });

        }else {
            alert(`You need ${level.requiredPoints - userPoints} more points to unlock this level.`);
        }
    };
    

    if (loading) {
        return <p>Loading points...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        
        <div className="levels-page">
        <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
            
            <h1>Choose Your Level</h1>
            <div className="levels-container">
                {levels.map((levelData) => (
                    <div key={levelData.level} className="level-container">
                        <button
                            onClick={() => navigateToLevel(levelData)}
                            className={`levellll-button ${userPoints >= levelData.requiredPoints ? '' : 'disabled'}`}
                            disabled={userPoints < levelData.requiredPoints}
                        >
                            Level {levelData.level}
                        </button>
                        <p className="level-label">Need {levelData.requiredPoints} points</p>
                    </div>
                ))}
            </div>
            <p className="points-message">
                You have {userPoints} points. Earn more points to unlock higher levels!
            </p>
            <Footer />

        </div>
    );
}

export default LevelsPage;
