import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TopPanel.css';

function TopPanel({ userImg, username, displayName, token }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // בדיקה אם יש state או נתונים מ-localStorage
  const state = location.state || {};
  const currentUserImg = state.userImg || localStorage.getItem("userImg") || userImg || '/profile.jpg';
  const currentUsername = state.username || localStorage.getItem("username") || username;
  const currentDisplayName = state.displayName || localStorage.getItem("displayName") || displayName;
  const currentToken = state.token || localStorage.getItem("token") || token;

  // שמירת הנתונים ב-localStorage כדי לוודא שהם נשמרים לאחר ניווטים
  useEffect(() => {
    if (currentUsername) localStorage.setItem("username", currentUsername);
    if (currentDisplayName) localStorage.setItem("displayName", currentDisplayName);
    if (currentUserImg) localStorage.setItem("userImg", currentUserImg);
    if (currentToken) localStorage.setItem("token", currentToken);
  }, [currentUsername, currentDisplayName, currentUserImg, currentToken]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
  
    // בדיקה שהתווים הם רק אותיות באנגלית
    const isValidEnglishWord = /^[a-zA-Z]+$/.test(trimmedQuery);
  
    if (!isValidEnglishWord) {
      alert("Please enter a word using English letters only, without spaces or special characters.");
      return;
    }
  
    if (trimmedQuery !== "") {
      navigate("/sign-word", {
        state: {
          word: trimmedQuery,
          username: currentUsername,
          displayName: currentDisplayName,
          userImg: currentUserImg,
          token: currentToken
        }
      });
    }
  };
  

  return (
    <header className="header">
      <div className="logo-search">
        <div className="logo-container">
          <img 
            src="/logoPink.png" 
            alt="Signly Logo"
            onClick={() => navigate("/", { state: { username: currentUsername, displayName: currentDisplayName, userImg: currentUserImg, token: currentToken } })} 
            className="logo-image" 
          />
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search a word..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        <button onClick={handleSearch} className="search-button">
  <img src="/magnifier.png" alt="Search" className="search-icon" />
</button>

        </div>
      </div>

      <nav className="nav-bar">
        <span onClick={() => navigate("/home", { state: { username: currentUsername, displayName: currentDisplayName, userImg: currentUserImg, token: currentToken } })} className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
          Home
        </span>
        <span onClick={() => navigate("/about", { state: { userImg: currentUserImg, username: currentUsername, displayName: currentDisplayName, token: currentToken } })} 
          className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
          About
        </span>
        <span 
          onClick={() => navigate("/contact", { state: { userImg: currentUserImg, username: currentUsername, displayName: currentDisplayName, token: currentToken } })}
          className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}
        >
          Contact Us
        </span>
      </nav>

      <div className="profile-container" onClick={() => navigate("/MyProfilePage", { state: { username: currentUsername, displayName: currentDisplayName, userImg: currentUserImg, token: currentToken } })}>
        <img src={currentUserImg} alt="Profile" className="profile-image" />
        <span className="profile-name">{currentDisplayName}</span>
      </div>
    </header>
  );
}

export default TopPanel;
