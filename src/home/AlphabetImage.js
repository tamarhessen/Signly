// AlphabetImage.js
import React from 'react';
import './AlphabetImage.css'; // הוסף את קובץ ה-CSS
import TopPanel from './TopPanel';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function AlphabetImage({ userImg, username, displayName, token }) {
    const navigate = useNavigate();
    
  return (
    <>
       
       <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />
      <div className="alphabet-image-container">
        
        <img src="/alphabet-image.png" alt="Alphabet in Sign Language" className="alphabet-image" />
     
      </div>
      <Footer />
    </>
  );
}

export default AlphabetImage;
