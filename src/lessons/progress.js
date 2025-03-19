import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './progress.css';

const levels = ['L', 'A', 'B'];

function Progress() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentLevel = location.state?.currentLevel || 0;

    const goToLesson = () => {
        navigate('/lesson', { state: { currentLevel } }); // מעבר לשלב הנוכחי ב-Lesson
    };

    return (
        <div className="progress-container">
            <h1 className="progress-title">Lesson Progress</h1>
            <div className="progress-path">
                {levels.map((level, index) => (
                    <div 
                        key={level} 
                        className={`progress-circle ${index <= currentLevel ? 'completed' : 'locked'}`}
                    >
                        {level}
                    </div>
                ))}
            </div>
            <button onClick={goToLesson} className="continue-button">Continue Lesson</button>
        </div>
    );
}

export default Progress;
