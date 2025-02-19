import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LeftPanel.css';

function LeftPanel() {
  const navigate = useNavigate();
  
  // Image carousel state
  const images = ['/hello.jpg', '/yes.jpg', '/no.jpg', '/thankyou.jpg', 'help.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="left-panel">
      <div className="carousel-container">
        <img 
          src={images[currentImageIndex]} 
          alt="Scrolling Images" 
          className="welcome-image" 
        />
      </div>
      <button 
        className="start-lesson-button" 
        onClick={() => navigate('/lesson')}
      >
        Start Lesson
      </button>
    </div>
  );
}

export default LeftPanel;