import React, { useEffect, useState } from 'react';
import './RightPanel.css';
//write
function RightPanel({ username, level, points, nextLevelPoints, navigate }) {
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(null);
  let pointsperlevel=(points-((level-1)*26)-1);
  // Fetch lives
  useEffect(() => {
    const abortController = new AbortController();

    async function fetchLives() {
      try {
        console.log("Fetching lives for user:", username);

        const res = await fetch(`http://localhost:5000/api/users/lives/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
        });

        console.log("Lives response status:", res.status);
        const data = await res.json();
        console.log("Lives data:", data);

        const livesValue = typeof data === 'number' ? data : data.lives;
        setLives(livesValue);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch lives:', err);
        }
      }
    }

    if (username) {
      fetchLives();
    }

    return () => abortController.abort();
  }, [username]);

  // Fetch time until next life (only when lives = 0)
  useEffect(() => {
    const abortController = new AbortController();

    async function fetchTimeLeft() {
      try {
        console.log("Fetching time until next life for:", username);

        const res = await fetch(`http://localhost:5000/api/users/time-until-life/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
        });

        console.log("Time response status:", res.status);
        const data = await res.json();
        console.log("Time data:", data);

        setTimeLeft(data.timeLeft);
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

  // Timer that decreases timeLeft by 1 each second
  useEffect(() => {
    let timer;
    if (timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

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
        <p>{pointsperlevel} points</p>
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
