// LeftPanel.js
import React from 'react';
import { Home, Book, Trophy, Settings, HelpCircle } from 'lucide-react';
import './LeftPanel.css';

function LeftPanel({ level, points, nextLevelPoints, navigate }) {
  const menuItems = [
    { icon: <Home size={20} />, text: 'Home', path: '/' },
    { icon: <Book size={20} />, text: 'About', path: '/About' },
    { icon: <Trophy size={20} />, text: 'Achievements', path: '/achievements' },
    { icon: <Settings size={20} />, text: 'Settings', path: '/settings' },
    { icon: <HelpCircle size={20} />, text: 'Help', path: '/help' }
  ];

  return (
    <div className="left-panel">
     
  

      <nav className="menu-section">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="menu-item"
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default LeftPanel;