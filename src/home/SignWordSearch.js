import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from '../home/TopPanel';
import Footer from '../home/Footer';
import Confetti from "react-confetti";
import '../lessons/Lesson.css';


const signImages = {
  A: '/signs/A.png', B: '/signs/B.png', C: '/signs/C.png', D: '/signs/D.png',
  E: '/signs/E.png', F: '/signs/F.png', G: '/signs/G.png', H: '/signs/H.png',
  I: '/signs/I.png', J: '/signs/J.png', K: '/signs/K.png', L: '/signs/L.png',
  M: '/signs/M.png', N: '/signs/N.png', O: '/signs/O.png', P: '/signs/P.png',
  Q: '/signs/Q.png', R: '/signs/R.png', S: '/signs/S.png', T: '/signs/T.png',
  U: '/signs/U.png', V: '/signs/V.png', W: '/signs/W.png', X: '/signs/X.png',
  Y: '/signs/Y.png', Z: '/signs/Z.png'
};

function SignWordSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { word, username: currentUsername, userImg: currentUserImg, displayName: currentDisplayName, token: currentToken } = location.state || {};

  const [currentWord, setCurrentWord] = useState('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [gesture, setGesture] = useState('Nothing');
  const [cameraActive, setCameraActive] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showSignImage, setShowSignImage] = useState(true);
  const [correctLetters, setCorrectLetters] = useState('');
  const [incorrectLetter, setIncorrectLetter] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canTryAgain, setCanTryAgain] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
console.log(currentUsername+"sss");
  useEffect(() => {
    if (word) {
      setCurrentWord(word.toUpperCase());
    }
  }, [word]);

  useEffect(() => {
    if (cameraActive && canTryAgain) {
      const interval = setInterval(() => {
        fetch('http://127.0.0.1:5001/detect_gesture')
          .then(response => response.json())
          .then(data => {
            if (!levelCompleted) {
              setGesture(data.gesture);

              if (!isLocked) {
                if (data.gesture === currentWord[currentLetterIndex]) {
                  setCorrectLetters(prev => prev + currentWord[currentLetterIndex]);
                  setCurrentLetterIndex(prev => prev + 1);
                } else if (data.gesture !== 'Nothing' && data.gesture !== currentWord[currentLetterIndex - 1]) {
                  setIncorrectLetter(true);
                  setIsLocked(true);
                  setCanTryAgain(false);
                  setErrorMessage(`❌ Incorrect! Try signing '${word}' again.`);
                }
              }

              if (currentLetterIndex === currentWord.length) {
                setLevelCompleted(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
              }
            }
          })
          .catch(error => console.error('Error fetching gesture:', error));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [cameraActive, currentLetterIndex, canTryAgain, currentWord, isLocked, levelCompleted]);

  const startCamera = () => {
    setShowSignImage(false);
    setCameraActive(true);
  };

  const retryGesture = () => {
    setIncorrectLetter(false);
    setIsLocked(false);
    setCanTryAgain(true);
  };
 
  const goBackToSearch = () => {

    navigate('/home', { state: { username: currentUsername, displayName:currentDisplayName, profilePictureURL: currentUserImg, token: currentToken } });

  };

  return (
    <>
      <TopPanel
        userImg={currentUserImg}
        username={currentUsername}
        displayName={currentDisplayName}
        navigate={navigate}
        token={currentToken}
      />

      <div className="cc-container">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        <div className="background-bll" style={{ backgroundImage: `url(/background.png)` }} />
        <h1 className="lesson-title">
                   Word:  {currentWord.split().map((letter, index) => (
                        <span key={index} className="text-lg font-bold">{letter} </span>
                    ))}
                </h1>
        {showSignImage ? (
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2">
              {currentWord.split('').map((letter, index) => (
                <img
                  key={index}
                  src={signImages[letter]}
                  alt={`Sign for ${letter}`}
                  className="sign-image"
                />
              ))}
            </div>
            <button onClick={startCamera} className="btn-primary">
              TRY IT YOURSELF
            </button>
          </div>
        ) : cameraActive ? (
          <div className="camera-container">
            <img
              src="http://127.0.0.1:5001/video_feed"
              alt="Camera Feed"
              className="camera-feed"
            />
            <div className="text-center w-full mt-4">
              <div className="gesture-display">
                <span className="gesture-text">{gesture === 'Nothing' ? '-' : gesture}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="signed-count" style={{ fontSize: '2rem' }}>
                Signed so far: {correctLetters}
              </p>
              <p className="text-lg text-gray-600 sign-instruction" style={{ fontSize: '2rem' }}>
                {isLocked ? "" : `Sign the letter: ${currentWord[currentLetterIndex] || ''}`}
              </p>
            </div>
            {incorrectLetter && (
              <div className="error-msg-box">
                <p className="error-text">{errorMessage}</p>
                <button onClick={retryGesture} className="start-button">Try Again</button>
              </div>
            )}
          </div>
        ) : null}

        {levelCompleted && (
          <div className="success-msg-box">
            <p className="success-text">
              ✅ Great job! You signed "{word}" correctly.
            </p>
            <button onClick={goBackToSearch} className="start-button">
              Back to Home Page
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default SignWordSearch;
