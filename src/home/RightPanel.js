import React, { useEffect, useState } from 'react';
import './RightPanel.css';

function RightPanel({ username, level, points, nextLevelPoints, navigate }) {
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(null);

  // מביא את כמות הלבבות
  useEffect(() => {
    fetch(`http://localhost:5000/lives/${username}`)
      .then(res => res.json())
      .then(data => {
        setLives(data.lives);
      })
      .catch(err => {
        console.error('Failed to fetch lives:', err);
      });
  }, [username]);

  // מביא את הזמן עד הלב הבא אם אין לבבות
  useEffect(() => {
    if (lives === 0) {
      fetch(`http://localhost:5000/time-until-life/${username}`)
        .then(res => res.json())
        .then(data => {
          setTimeLeft(data.timeLeft); // timeLeft in seconds
        })
        .catch(err => {
          console.error('Failed to fetch time until next life:', err);
        });
    } else {
      setTimeLeft(null); // אם יש לבבות אין צורך להציג זמן
    }
  }, [username, lives]);

  // טיימר שמוריד שנייה בכל שנייה
  useEffect(() => {
    let timer;
    if (timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));

      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // תצוגת זמן בפורמט דקות:שניות
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="right-panel">
      <h3>Your Progress</h3>
      <div className="progress-info">
        <p>Level: {level}</p>
        <progress value={points} max={nextLevelPoints} className="progress-bar" />
        <p>{points}/{nextLevelPoints} points</p>
      </div>
      <div className="lives-info">
        <p>Lives: {'❤️'.repeat(lives)} {lives}/3</p>
        {lives === 0 && timeLeft !== null && timeLeft > 0 && (
          <p className="time-wait">⏳ Please wait: {formatTime(timeLeft)}</p>
        )}
      </div>
    </div>
  );
}

export default RightPanel;
