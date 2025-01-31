import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MainScreen.css';
import About from '../About'; // Import About component
import RightPanel from './RightPanel';
import TopPanel from './TopPanel';
import Footer from './Footer';
import LeftPanel from './LeftPanel'; // Import LeftPanel

function MainScreen({ setLoggedIn, username, displayName, userImg, mode, token }) {
  const navigate = useNavigate();

  // User progress data
  const userProgress = {
    level: 3,
    points: 500,
    nextLevelPoints: 1000,
  };

  // Image carousel state
  const images = ['/FrontPage1.jpg', '/FrontPage2.jpg', '/FrontPage1.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-screen">
      {/* Top Panel */}
      <TopPanel userImg={userImg} navigate={navigate} />

      {/* Main Content */}
      <div className="content-container">
        {/* Left Side Panel */}
        <LeftPanel displayName={displayName} navigate={navigate} /> {/* Only one LeftPanel */}

        {/* Main Feed Center and Right Panel */}
        <main className="main-content">
          <div className="home-screen">
            <h1>Welcome to Signly!</h1>
            <img src={images[currentImageIndex]} alt="Scrolling Images" className="welcome-image" />
            <button className="start-lesson-button" onClick={() => navigate('/lesson')}>
              Start Lesson
            </button>
          </div>
        </main>

        {/* Right Panel */}
        <RightPanel
          level={userProgress.level}
          points={userProgress.points}
          nextLevelPoints={userProgress.nextLevelPoints}
          navigate={navigate}
        />
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default MainScreen;
