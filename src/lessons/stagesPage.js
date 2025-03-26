import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopPanel from '../home/TopPanel';

function StagesPage({ userImg, username, displayName, token, points }) {
    const location = useLocation();
    const { userImg: locationUserImg, username: locationUsername, displayName: locationDisplayName, token: locationToken, points: locationPoints } = location.state || {};

    const currentUserImg = userImg || locationUserImg;
    const currentUsername = username || locationUsername;
    const currentDisplayName = displayName || locationDisplayName;
    const currentToken = token || locationToken;
    const currentPoints = points || locationPoints || 0; // Default to 0 if no points

    const [userPoints, setUserPoints] = useState(currentPoints);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const stages = [
        { stage: 1, title: 'Learning Letters', requiredPoints: 0 },
        { stage: 2, title: 'Learning Words', requiredPoints: 100 },
        { stage: 3, title: 'Sentences', requiredPoints: 200 },
        // Add more stages as needed
    ];

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

    const navigateToLevel = (stage) => {
        if (userPoints >= stage.requiredPoints) {
            navigate(`/lesson/${stage.stage}`, { state: { username: currentUsername, points: userPoints } });
        } else {
            alert(`You need ${stage.requiredPoints - userPoints} more points to unlock this stage.`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUsername, currentToken]);

    if (loading) {
        return <p>Loading points...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="stages-page">
            <h1>Choose Your Stage</h1>
            <div className="stages-container">
                {stages.map((stageData) => (
                    <div key={stageData.stage} className="stage-container">
                        <button
                            onClick={() => navigateToLevel(stageData)}
                            className={`stage-button ${userPoints >= stageData.requiredPoints ? '' : 'disabled'}`}
                            disabled={userPoints < stageData.requiredPoints}
                        >
                            {stageData.title}
                        </button>
                        <p className="stage-label">Need {stageData.requiredPoints} points</p>
                    </div>
                ))}
            </div>
            <p className="points-message">
                You have {userPoints} points. Earn more points to unlock higher stages!
            </p>
        </div>
    );
}

export default StagesPage;
