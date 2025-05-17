import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import './Levels.css'; // Use same CSS as base design

function Levels() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userPoints, setUserPoints] = useState(currentPoints);
    const [initialized, setInitialized] = useState(false);

    const levels = [
        'daddy', 'rocket', 'jungle', 'garden', 'castle', 'forest', 'butterfly', 'diamond', 'sunshine', 'rainbow',
        'mountain', 'friendship', 'computer', 'elephant', 'building', 'fireworks', 'backpack', 'treasure', 'vacation',
        'adventure', 'airplane', 'birthday', 'chocolate', 'dinosaur', 'festival', 'lighthouse'
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
                    <h1>Pick a word and continue your journey</h1>
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
                        {levels.map((word, index) => {
                            const isUnlocked = index + 52 < unlockedLevels;
                            const isNext = index + 52 === unlockedLevels - 1;

                            return (
                                <button
                                    key={word}
                                    onClick={() => {
                                        if (isUnlocked) {
                                            navigate(`/lesson3/${word}`, {
                                                state: {
                                                    word,
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
                                    {word}
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

export default Levels;
