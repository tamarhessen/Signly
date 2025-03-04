import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MainScreen.css';
import About from '../About'; // Import About component
import RightPanel from './RightPanel';
import TopPanel from './TopPanel';
import Footer from './Footer';
//import LeftPanel from './LeftPanel'; // Import LeftPanel
import Navigation from './Navigation'; // Import Navigation
import { Link } from 'react-router-dom';

function MainScreen({ setLoggedIn, username, displayName, userImg, mode, token }) {
  const navigate = useNavigate();

  // User progress data
  const userProgress = {
    level: 3,
    points: 500,
    nextLevelPoints: 1000,
  };

  // Image carousel state
  const images = ['/hello.jpg', '/yes.jpg', '/no.jpg', '/thankyou.jpg','help.jpg'];
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
      <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token}/>


      {/* Main Content */}
      <div className="content-container">
        

        {/* Main Feed Center and Right Panel */}
        <main className="main-content">
          <div className="home-screen">
            <img src={images[currentImageIndex]} alt="Scrolling Images" className="welcome-image" />
            <Link
              to="/lesson"
              state={{ username, displayName, userImg }}
              className="start-lesson-button"
         >
  Start Lesson
</Link>
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
