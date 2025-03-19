import React, { useEffect } from 'react';
import './RightPanel.css'; // Import CSS

function RightPanel({ level, points, nextLevelPoints, navigate }) {
  useEffect(() => {
    console.log("RightPanel received props ->", {
      level,
      points,
      nextLevelPoints
    });
  }, [level, points, nextLevelPoints]);

  return (
    <div className="right-panel">
      <h3>Your Progress</h3>
      <div className="progress-info">
        <p>Level: {level}</p>
        <progress value={points} max={nextLevelPoints} className="progress-bar" />
        <p>{points}/{nextLevelPoints} points</p>
      </div>
    </div>
  );
}

export default RightPanel;
