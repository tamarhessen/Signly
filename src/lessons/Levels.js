import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import './Levels.css';

function Levels() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { currentUserImg, currentUsername, currentDisplayName, currentToken, currentPoints } = location.state || {};
    
    const levels = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // 'A' (65) to 'Z' (90)
    const [userPoints, setUserPoints] = useState(currentPoints);
    const [starAnimation, setStarAnimation] = useState(false);
    
    // Calculate spiral position for galaxy theme
    const calculatePosition = (index) => {
        const angle = index * 0.5; // Angular change
        const radius = 170 + Math.pow(index, 1.5) * 2.2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { transform: `translate(${x}px, ${y}px)` };
    };

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
        
        // Create random star background
        createStars();
        
        // Trigger initial star animation
        setTimeout(() => {
            setStarAnimation(true);
        }, 100);
    }, []);
    
    const createStars = () => {
        const starsContainer = document.querySelector('.galaxy-background');
        if (!starsContainer) return;
        
        // Clear existing stars
        starsContainer.innerHTML = '';
        
        // Create new stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random position
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation delay
            star.style.animationDelay = `${Math.random() * 10}s`;
            
            starsContainer.appendChild(star);
        }
    };

    // Calculate the number of unlocked levels based on userPoints
    const unlockedLevels = userPoints + 1;

    return (
        <div className="game-container">
            <TopPanel 
                userImg={currentUserImg} 
                username={currentUsername} 
                displayName={currentDisplayName} 
                navigate={navigate} 
                token={currentToken} 
            />
            
            <div className="galaxy-background"></div>
            
            <div className="points-display">
                <div className="points-container">
                    <div className="points-icon">⭐</div>
                    <div className="points-counter">
                        <div className="points-label">POINTS</div>
                        <div className="points-value">{userPoints}</div>
                    </div>
                </div>
            </div>
            
            <div className="back-button">
                <button
                    onClick={() => navigate('/home', {
                        state: {
                            currentUserImg,
                            currentUsername,
                            currentDisplayName,
                            currentToken,
                            userPoints
                        }
                    })}
                >
                    <span className="back-icon">◀</span> Home
                </button>
            </div>
            
            <div className="game-title">
                <h1>Galaxy Letters</h1>
                <div className="title-decoration"></div>
            </div>
            
            <div className="levels-galaxy-wrapper">
                <div className="galaxy-center"></div>
                
                {levels.map((level, index) => {
                    const isUnlocked = index < unlockedLevels;
                    const isNext = index === unlockedLevels - 1;
                    
                    return (
                        <button
                            key={level}
                            onClick={() => navigate(`/lesson/${level}`, { 
                                state: { 
                                    letter: level, 
                                    currentUserImg, 
                                    currentUsername, 
                                    currentDisplayName, 
                                    currentToken, 
                                    currentPoints: userPoints 
                                } 
                            })}
                            className={`level-planet ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'next-level' : ''}`}
                            disabled={!isUnlocked}
                            style={calculatePosition(index)}
                        >
                            {level}
                            {isUnlocked && <div className="planet-glow"></div>}
                            {isNext && <div className="next-indicator"></div>}
                        </button>
                    );
                })}
                
                <div className="orbit-paths">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="orbit-path" style={{ width: `${340 + i * 120}px`, height: `${340 + i * 120}px` }}></div>
                    ))}
                </div>
            </div>
            
            <div className="level-info-panel">
                <div className="level-progress">
                    <div className="progress-label">Progress</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(unlockedLevels / levels.length) * 100}%` }}></div>
                    </div>
                    <div className="progress-stats">{unlockedLevels} / {levels.length} levels</div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Levels;