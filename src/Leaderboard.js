import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from './home/TopPanel';
import Footer from './home/Footer';
import './Leaderboard.css';

function Leaderboard() {
    const location = useLocation();
    const { currentUserImg, currentUsername, currentDisplayName, currentToken } = location.state || {};
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/leaderboard/${currentUsername}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => b.points - a.points); // מיון לפי נקודות
                    setLeaderboard(sortedData);
                } else {
                    setLeaderboard([]);
                }
            })
            .catch(err => console.error('Error fetching leaderboard:', err));
    }, [currentUsername]);
    

    return (
        <>
          <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
          <div className="main-container">
          <div className="background-b" style={{ backgroundImage: `url(/background.png)` }}></div>
          <div className="leaderboard-container">
            <h2 className="leaderboard-title">🏆 Leaderboard 🏆</h2>
            <ul className="leaderboard-list">
              {leaderboard.map((player, index) => (
                <li
                  key={index}
                  className={`leaderboard-item ${player.username === currentDisplayName ? 'highlight' : ''}`}
                >
                  <span className="rank">#{index + 1}</span>
                  <img className="pic" src={player.pic} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <span className="name">{player.username}</span>
                  <span className="points">{player.points}</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
          <Footer />
          </>
      );
      
}

export default Leaderboard;
