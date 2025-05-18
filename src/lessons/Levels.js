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
    const [initialized, setInitialized] = useState(false);
    
    // Calculate the number of unlocked levels based on userPoints
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
        

        // Trigger initial animation
        setTimeout(() => {
            setInitialized(true);
        }, 100);
    }, []);
    
   
    return (
         <>
        <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
        <div className="game-container">

        <div className="background-b" style={{ backgroundImage: `url(/background.png)` }}></div>
            
            <div className="game-title">
                <h1>Pick a letter and start learning</h1>
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

            {/* Snake-like learning path */}
            <div className={`snake-path-container ${initialized ? 'initialized' : ''}`}>
                {/* Path background */}
              

                
                {/* Levels positioned along the path */}
<div className="levels-container">
  {levels.map((level, index) => {
    const isUnlocked = index < unlockedLevels;
    const isNext = index === unlockedLevels - 1;

    return (
      <button
        key={level}
        onClick={() => {
          if (isUnlocked) {
            navigate(`/lesson/${level}`, {
              state: {
                letter: level,
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
        {level}
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