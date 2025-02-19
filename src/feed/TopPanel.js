import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import './TopPanel.css';

function TopPanel({ userImg, navigate }) {
  const location = useLocation(); // Get the current location
  
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
        <span 
          onClick={() => navigate("/")}
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`} // Apply "active" class if on the homepage
        >
          Home
        </span>
        <span 
          onClick={() => navigate("/about")}
          className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} // Highlight About link when on the About page
        >
          About
        </span>
        <span 
          onClick={() => navigate("/contact")}
          className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`} // Highlight Contact Us link when on the Contact page
        >
          Contact Us
        </span>
      </nav>

      <div className="profile-picture" onClick={() => navigate("/profile")}>
        <img 
          src={userImg || '/profile.jpg'} 
          alt="Profile" 
          className="profile-image" 
        />
      </div>
    </header>
  );
}

export default TopPanel;
