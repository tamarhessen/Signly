import React, { useEffect, useState } from 'react';
import './RightPanel.css';

function RightPanel({ username, level, points, nextLevelPoints, navigate }) {
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(null);
  let pointsperlevel = (points - ((level - 1) * 26));

  // פונקציה חיצונית שנוכל לקרוא גם מתוך useEffect אחר
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

  // קריאה ראשונית להבאת לבבות
  useEffect(() => {
    const abortController = new AbortController();
    if (username) {
      fetchLives(abortController.signal);
    }
    return () => abortController.abort();
  }, [username]); // טריגר לכל שינוי ב-username

  // הבאת זמן להמתנה רק אם אין לבבות
  useEffect(() => {
    const abortController = new AbortController();

    async function fetchTimeLeft() {
      try {
        const res = await fetch(`http://localhost:5000/api/users/time-until-life/${username}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal,
        });

        const data = await res.json();
        setTimeLeft(data.waitTime);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch time until next life:', err);
        }
      }
    }

    if (username && lives === 0) {
      fetchTimeLeft();
    } else {
      setTimeLeft(null);
    }

    return () => abortController.abort();
  }, [username, lives]);

  // טיימר שמעדכן כל שנייה, ואם נגמר הזמן – טען לבבות מחדש ונווט לעמוד הבית
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          fetchLives(); // טוען את הלבבות מחדש ברגע שנגמר הזמן
         
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigate]);

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
        <progress value={pointsperlevel} max={nextLevelPoints} className="progress-bar" />
        <p>{pointsperlevel}/26 points</p>
      </div>
      <div className="lives-info">
        <p>
          Lives:{' '}
          {[...Array(3)].map((_, i) => (
            <span key={i}>{i < lives ? '❤️' : '🤍'}</span>
          ))} {lives}/3
        </p>

        {lives === 0 && timeLeft !== null && timeLeft > 0 && (
          <p className="time-wait">⏳ Please wait: {formatTime(timeLeft)}</p>
        )}
      </div>
    </div>
  );
}

export default RightPanel;  