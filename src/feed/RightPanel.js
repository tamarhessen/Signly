// RightPanel.js
import React from 'react';
import './RightPanel.css'; // Import CSS

function RightPanel({ level, points, nextLevelPoints, navigate }) {
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
