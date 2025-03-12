import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainScreen.css';
import RightPanel from './RightPanel';
import TopPanel from './TopPanel';
import Footer from './Footer';

function MainScreen({ setLoggedIn, username, displayName, userImg, mode, token }) {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(1000);
  const [error, setError] = useState(null);

  // Image carousel state
  const images = ['/hello.jpg', '/yes.jpg', '/no.jpg', '/thankyou.jpg', '/help.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fun Fact Section
  const funFacts = [
    "Facial expressions are an essential part of sign language! 😃",
    "ASL is not universal! Every country has its own sign language. 🌍",
    "The first sign language dictionary was published in 1965. 📖",
    "Some deaf individuals prefer signing over written language for faster communication. ✍️"
  ];
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    }, 5000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(factInterval);
    };
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
      <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />

      <div className="content-container">
        <main className="main-content">
          <div className="home-screen">
            <h1 className="animated-title">👋 Welcome to Sign Language Learning!</h1>
            <p className="animated-subtitle">
              Learn sign language interactively through lessons and challenges. Earn points and level up as you progress!
            </p>

            <div className="carousel-container">
              <img src={images[currentImageIndex]} alt="Sign Language Example" className="carousel-image" />
            </div>

            <Link to="/lesson" state={{ username, displayName, userImg }} className="start-lesson-button">
              Start Lesson 🚀
            </Link>
              {/* Button to view image of English Alphabet in sign language */}
              <Link to="/alphabet-image" className="start-lesson-button">
              View Alphabet in Sign Language 🅰️
            </Link>

            <div className="fun-fact">
              <h3>💡 Did you know?</h3>
              <p>{funFacts[currentFactIndex]}</p>
            </div>
          </div>
        </main>

        <RightPanel level={level} points={points} nextLevelPoints={nextLevelPoints} navigate={navigate} />
      </div>

      <div className="useful-links">
        <h3>🌟 Explore More</h3>
        <div className="links-container">
          <Link to="/about" className="link-button">📘 About Sign Language</Link>
          <Link to="/faq" className="link-button">❓ FAQs</Link>
          <Link to="/profile" className="link-button">🏆 Your Achievements</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MainScreen;
