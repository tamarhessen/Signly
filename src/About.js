import React from 'react';
import './About.css';  // Make sure to link the updated CSS file
import TopPanel from './home/TopPanel';
import Footer from './home/Footer';
import { useNavigate } from 'react-router-dom';

function About({ userImg, username, displayName, token }) {
   const navigate = useNavigate();
  return (
    <>
       
    <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />
    <div className="about-page">
      
      <h1>✨ About Us ✨</h1>
      <p><span role="img" aria-label="hand">🖐️</span> Welcome to Signly! Our mission is to help people learn sign language easily and effectively using cutting-edge technology.</p>
      <p><span role="img" aria-label="camera">📸</span> Signly is an interactive platform that uses your camera to help users practice sign language. Whether you're a beginner or advanced learner, we provide real-time feedback on your progress.</p>
      <p><span role="img" aria-label="heart">❤️</span> We are committed to making sign language education accessible to everyone!</p>
      
    </div>
    <Footer />
    </>
  );
}

export default About;
