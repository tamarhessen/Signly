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
    const [userHearts, setUserHearts] = useState(3); // Add hearts state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasCompletedTraining, setHasCompletedTraining] = useState(false); // Track training completion

    const navigate = useNavigate();

    // Updated levels array - Level 1 is now training, others require training completion
    const levels = [
        { 
            level: 1, 
            requiredPoints: 0, 
            isTraining: true,
            title: "Training Level",
            description: "Master the basics and earn points! Complete this level to unlock others."
        },
        { 
            level: 2, 
            requiredPoints: 26, 
            isTraining: false,
            title: "Basic Words",
            description: "Practice basic everyday words to strengthen your sign language vocabulary."
        },
        { 
            level: 3, 
            requiredPoints: 52, 
            isTraining: false,
            title: "Advanced Words", 
            description: "Learn advanced words to expand your fluency and expressiveness in sign language."
        },
        { 
            level: 4, 
            requiredPoints: 78, 
            isTraining: false,
            title: "Full Sentences",
            description: "Practice full sentences to become fluent in everyday sign language conversations."
        },
    ];

    // Function to fetch user data from the server
    const fetchData = async () => {
        try {
            console.log("Fetching user data for:", currentUsername);

            // Fetch points
            const pointsRes = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
            });

            if (pointsRes.ok) {
                const points = await pointsRes.text();
                setUserPoints(Number(points));
            }

            // Fetch hearts - you'll need to add this endpoint to your backend
            const heartsRes = await fetch(`http://localhost:5000/api/users/lives/${currentUsername}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
            });

            if (heartsRes.ok) {
                const hearts = await heartsRes.text();
                setUserHearts(Number(hearts));
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to mark training as completed
    const completeTraining = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/complete-training`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
            });

            if (res.ok) {
                setHasCompletedTraining(true);
                // Award hearts for completing training
                setUserHearts(prev => Math.min(prev + 2, 5)); // Add 2 hearts, max 5
            }
        } catch (error) {
            console.error("Error completing training:", error);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, [currentUsername, currentToken]);

    const navigateToLevel = (level) => {
        if (userPoints < level.requiredPoints) {
            alert(`You need ${level.requiredPoints - userPoints} more points to unlock this level.`);
            return;
        }

        // Navigate to appropriate level
        const levelRoutes = {
            1: '/levels26',
            2: '/level2',
            3: '/level3',
            4: '/level4'
        };

        navigate(levelRoutes[level.level], { 
            state: { 
                currentUserImg, 
                currentUsername, 
                currentDisplayName, 
                currentToken, 
                currentPoints: userPoints,
                currentHearts: userHearts
            } 
        });
    };

const isLevelUnlocked = (level) => {
    return userPoints >= level.requiredPoints;
};

const getLevelStatus = (level) => {
    if (userPoints < level.requiredPoints) {
        return "Locked - Need More Points";
    }
    return `Start Level ${level.level}`;
};

    if (loading) {
        return <p>Loading user data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="root-title-class">
            <div className="mainscreen-headed">
                <TopPanel
                    userImg={currentUserImg}
                    username={currentUsername}
                    displayName={currentDisplayName}
                    navigate={navigate}
                    token={currentToken}
                />
            </div>

            <div className="contentcontainer levels-page">
                <div className="background-be" style={{ backgroundImage: `url(/background.png)` }}/>
                
                <h1 className="levels-title">Choose Your Level</h1>
                
                {/* Training Status Banner */}
                <div className={`training-status ${hasCompletedTraining ? 'completed' : 'pending'}`}>
                    {hasCompletedTraining ? (
                        <p>🎉 Training Completed! You can now access all levels.</p>
                    ) : (
                        <p>⚠️ Complete the Training Level first to unlock other levels and earn hearts!</p>
                    )}
                </div>

                <div className="levels-grid">
                    {levels.map((levelData) => {
                        const isUnlocked = isLevelUnlocked(levelData);
                        const status = getLevelStatus(levelData);
                        
                        return (
                            <div
                                key={levelData.level}
                                className={`level-card ${isUnlocked ? '' : 'locked'} ${levelData.isTraining ? 'training-level' : ''}`}
                                onClick={() => {
                                    if (isUnlocked || levelData.isTraining) {
                                        navigateToLevel(levelData);
                                    } else if (!hasCompletedTraining) {
                                        alert("Complete the Training Level first!");
                                    } else {
                                        alert(`You need ${levelData.requiredPoints - userPoints} more points to unlock this level.`);
                                    }
                                }}
                            >
                                <div className="level-info">
                                    <h2>
                                        {levelData.isTraining ? "🎓 " : ""}
                                        {levelData.title}
                                        {levelData.isTraining && hasCompletedTraining ? " ✓" : ""}
                                    </h2>
                                    <p>{levelData.description}</p>
                                  
                                    <button
                                        className={`level-button ${levelData.isTraining ? 'training-button' : ''}`}
                                        disabled={!isUnlocked && !levelData.isTraining}
                                    >
                                        {status}
                                    </button>
                                </div>
                                <div className="level-image">
                                    <img
                                        src={levelData.isTraining ? '/training.png' : `/level${levelData.level}.png`}
                                        alt={`${levelData.title} illustration`}
                                        className="level-illustration"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="user-stats">
                    <p className="points-message">
                        💯 Points: {userPoints} | 💖 Hearts: {userHearts}
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LevelsPage;