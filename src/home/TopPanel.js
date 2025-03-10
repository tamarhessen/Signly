import React from 'react';
import { useLocation } from 'react-router-dom';
import './TopPanel.css';

function TopPanel({ userImg, username, displayName, navigate,token }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="logo-search">
        <div className="logo-container">
          <img 
            src="/logoPink.png" 
            alt="Signly Logo"
            onClick={() => navigate("/")}
            className="logo-image" 
          />
        </div>
        <input 
          type="text" 
          placeholder="Search for a sign..." 
          className="search-bar" 
        />
      </div>

      <nav className="nav-bar">
        <span onClick={() => navigate("/")} className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
          Home
        </span>
        <span onClick={() => navigate("/about")} className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
          About
        </span>
        <span onClick={() => navigate("/contact")} className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}>
          Contact Us
        </span>
      </nav>

      <div className="profile-container" onClick={() => navigate("/MyProfilePage", { state: { username, displayName, userImg,token } })}>
        <img src={userImg || '/profile.jpg'} alt="Profile" className="profile-image" />
        <span className="profile-name">{displayName}</span> {/* Show display name */}
      </div>
    </header>
  );
}

export default TopPanel;
