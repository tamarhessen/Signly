import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MainScreen.css';
import About from '../About';
import RightPanel from './RightPanel';
import TopPanel from './TopPanel';
import Footer from './Footer';
import Navigation from './Navigation';
import { Link } from 'react-router-dom';

function MainScreen({ setLoggedIn, username, displayName, userImg, mode, token }) {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(1000);
  const [error, setError] = useState(null);

  // Image carousel state
  const images = ['/hello.jpg', '/yes.jpg', '/no.jpg', '/thankyou.jpg', '/help.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${username}/points`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `bearer ${token}`,
          },
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
      
        
        const json = await res.json();
        console.log("User Data:", json);

        console.log("points"+json.points);
        setPoints(json.points);
      
        const calculatedLevel = Math.floor(json.points / 500) + 1;
        setLevel(calculatedLevel);
        setNextLevelPoints((calculatedLevel * 500) + 500);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      }
    }

    if (username) {
      fetchData();
    }

    return () => abortController.abort();
  }, [username, token]);

  return (
    <div className="main-screen">
      {/* Top Panel */}
      <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />

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
          level={level}
          points={points}
          nextLevelPoints={nextLevelPoints}
          navigate={navigate}
        />
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default MainScreen;
