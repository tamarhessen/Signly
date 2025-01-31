import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MainScreen.css'; 
import MainFeedCenter from './MainFeedCenter'; 
import RightPanel from './RightPanel'; 
import TopPanel from './TopPanel';
import Footer from './Footer';

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
     <main className="main-content">
        <div className="content-container">
          <div className="home-screen">
            <h1>Welcome to Signly!</h1>
            <img src={images[currentImageIndex]} alt="Scrolling Images" className="welcome-image" />
            <button className="start-lesson-button" onClick={() => navigate('/lesson')}>
              Start Lesson
            </button>
          </div>
        </div>

        {/* Right Panel for Progress */}
        <RightPanel 
          level={userProgress.level} 
          points={userProgress.points} 
          nextLevelPoints={userProgress.nextLevelPoints} 
          navigate={navigate} 
        />
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default MainScreen;
