import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import './Levels.css'; // Reuse shared styling for consistency

function Level4() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userPoints, setUserPoints] = useState(currentPoints);
    const [initialized, setInitialized] = useState(false);

    const levels = [
        'Dad ca dac', 'The rocket flies', 'We love the jungle', 'Flowers in the garden', 'The castle is big',
        'Birds in the forest', 'A butterfly lands', 'The diamond shines', 'The sunshine is bright', 'A rainbow appears',
        'Climb the mountain', 'Friendship is strong', 'Use the computer', 'An elephant walks', 'The building is tall',
        'Fireworks explode', 'Pack the backpack', 'Find the treasure', 'Enjoy the vacation', 'Adventure awaits',
        'The airplane lands', 'It is my birthday', 'I love chocolate', 'A dinosaur roars', 'Join the festival', 'The lighthouse glows'
    ];

    const unlockedLevels = userPoints + 1;

    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${currentUsername}/points`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${currentToken}`,
                },
            });

            if (res.ok) {
                const points = await res.text();
                setUserPoints(Number(points));
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
        setTimeout(() => setInitialized(true), 100);
    }, []);

    return (
        <>
            <TopPanel
                userImg={currentUserImg}
                username={currentUsername}
                displayName={currentDisplayName}
                navigate={navigate}
                token={currentToken}
            />

            <div className="game-container">
                <div className="game-title">
                    <h1>Pick a sentence and continue your journey</h1>
                    <div className="title-decoration"></div>
                </div>

                <div className="points-counter">
                    <div className="points-label">POINTS</div>
                    <div className="points-value">{userPoints}</div>
                </div>

                <div className="back-levels-button">
                    <button
                        onClick={() => navigate('/levels', {
                            state: {
                                currentUserImg,
                                currentUsername,
                                currentDisplayName,
                                currentToken,
                                userPoints
                            }
                        })}
                    >
                        <span className="back-icon">◀</span> Back to levels
                    </button>
                </div>

                <div className={`snake-path-container ${initialized ? 'initialized' : ''}`}>
                    <div className="levels-container">
                        {levels.map((sentence, index) => {
                            const isUnlocked = index + 78 < unlockedLevels; 
                            const isNext = index + 78 === unlockedLevels - 1;

                            return (
                                <button
                                    key={sentence}
                                    onClick={() => {
                                        if (isUnlocked) {
                                            navigate(`/lesson4/${sentence}`, {
                                                state: {
                                                    word: sentence,
                                                    currentUserImg,
                                                    currentUsername,
                                                    currentDisplayName,
                                                    currentToken,
                                                    currentPoints: userPoints
                                                }
                                            });
                                        }
                                    }}
                                    className={`level-node ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'next-level' : ''}`}
                                    disabled={!isUnlocked}
                                >
                                    {sentence}
                                    {isUnlocked && <div className="completed-check"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Level4;
