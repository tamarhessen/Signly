import React from 'react';
import './About.css';  // Make sure to link the updated CSS file
import TopPanel from './home/TopPanel';
import Footer from './home/Footer';
import { useNavigate } from 'react-router-dom';

function About({ userImg, username, displayName, token }) {
   const navigate = useNavigate();
  return (
    <>
       <TopPanel userImg={`${userImg}?t=${new Date().getTime()}`} username={username} displayName={displayName} navigate={navigate} token={token} />   
       
<div className="main-container">
<div className="background-b" style={{ backgroundImage: `url(/background.png)` }}></div>
        <div className="about-page">
      
      <h1>✨ About Us ✨</h1>
      <p><span role="img" aria-label="hand">🖐️</span> Welcome to Signly! Our mission is to help people learn sign language easily and effectively using cutting-edge technology.</p>
      <p><span role="img" aria-label="camera">📸</span> Signly is an interactive platform that uses your camera to help users practice sign language. Whether you're a beginner or advanced learner, we provide real-time feedback on your progress.</p>
      <p><span role="img" aria-label="heart">❤️</span> We are committed to making sign language education accessible to everyone!</p>
      <h2 className="section-title">Here is how it works</h2>
            <div className="features-container">
              <div className="feature">
                <div className="icon">
                  <span role="img" aria-label="camera">📷</span>
                </div>
                <div className="feature-content">
                  <h3>Perfect Your Signs</h3>
                  <p>Practice sign language by performing gestures in front of your camera. Our advanced recognition technology gives you instant feedback on your signing accuracy.</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="icon">
                  <span role="img" aria-label="level-up">🏆</span>
                </div>
                <div className="feature-content">
                  <h3>Level Up Your Skills</h3>
                  <p>Complete signing challenges correctly to earn points and advance to new levels. Each level introduces more complex signs and phrases to master.</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="icon">
                  <span role="img" aria-label="hearts">❤️</span>
                </div>
                <div className="feature-content">
                  <h3>Life System</h3>
                  <p>Careful with your attempts! Each incorrect sign costs you a heart. Run out of hearts and you'll need to wait before trying again. Practice makes perfect!</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="icon">
                  <span role="img" aria-label="dictionary">📚</span>
                </div>
                <div className="feature-content">
                  <h3>Sign Dictionary</h3>
                  <p>Access our comprehensive sign language dictionary to look up specific signs or phrases anytime. Study the correct form before attempting the challenges.</p>
                </div>
              </div>
           
          </div>
    </div>
    </div>
    <Footer />
    </>
  );
}

export default About;
