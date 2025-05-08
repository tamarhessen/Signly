import React, { useEffect, useState } from 'react';
import './RightPanel.css';

function RightPanel({ username, level, points, nextLevelPoints, navigate }) {
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(null);

  let pointsperlevel = (points - ((level - 1) * 26));

  async function fetchLives(abortSignal = null) {
    try {
      const res = await fetch(`http://localhost:5000/api/users/lives/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: abortSignal
      });

      const data = await res.json();
      const livesValue = typeof data === 'number' ? data : data.lives;
      setLives(livesValue);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch lives:', err);
      }
    }
  }

  async function fetchTimeLeft(abortSignal = null) {
    try {
      const res = await fetch(`http://localhost:5000/api/users/time-until-life/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: abortSignal
      });

      const data = await res.json();
      setTimeLeft(data.waitTime);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch time until next life:', err);
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    if (username) {
      fetchLives(abortController.signal);
    }
    return () => abortController.abort();
  }, [username]);

  useEffect(() => {
    const abortController = new AbortController();

    if (username && lives === 0) {
      fetchTimeLeft(abortController.signal);
    } else {
      setTimeLeft(null);
    }

    return () => abortController.abort();
  }, [username, lives]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(async () => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);

          // שלב 1: בקשת חיים מחדש
          fetchLives();

          // שלב 2: בקשת זמן מחדש
          fetch(`http://localhost:5000/api/users/time-until-life/${username}`)
            .then(res => res.json())
            .then(data => {
              if (data.waitTime <= 0) {
                setLives(3);         // עדכון חיים
                setTimeLeft(null);   // איפוס טיימר
              } else {
                setTimeLeft(data.waitTime); // עדכון זמן חדש
              }
            })
            .catch(err => console.error('Error rechecking time:', err));

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, username]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="right-panel">
      <h2>Your Progress</h2>

      <div className="level-info">
        <p>Level: {level}</p>
        <progress value={pointsperlevel} max={nextLevelPoints} className="progress-bar" />
        <p>{pointsperlevel}/26 points</p>
      </div>

      <div className="lives-section">
        <p>
          Lives:{' '}
          {[...Array(3)].map((_, i) => (
            <span key={i}>{i < lives ? '❤️' : '🤍'}</span>
          ))} {lives}/3
        </p>

        {lives === 0 && timeLeft !== null && timeLeft > 0 && (
          <p>⏳ Please wait: {formatTime(timeLeft)}</p>

       
         // <p className="time-wait">⏳ Please wait: {formatTime(timeLeft)}</p>


        )}
      </div>
    </div>
  );
}

export default RightPanel;
