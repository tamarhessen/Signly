import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import HomeScreen from './home/HomeScreen';
import About from './About'; // Import the About component
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { Modal } from 'bootstrap';
import { authenticateUser } from './Users';
import { LoggedIn } from './loggedIn';

import MyProfilePage from './home/MyProfilePage';
import AlphabetImage from './home/AlphabetImage';
import ContactUs from './home/ContactUs';

import MainScreen from './home/MainScreen'; // Import MainScreen (updated path)
import Lesson from './lessons/Lesson'; 
import Levels from './lessons/Levels.js'; 
import Level2 from './lessons/Level2.js';
import Lesson2 from './lessons/Lesson2';
import Level3 from './lessons/Level3.js';
import Lesson3 from './lessons/Lesson3';
import Level4 from './lessons/Level4.js';
import Lesson4 from './lessons/Lesson4';
import SignWordSearch from './home/SignWordSearch.js';
import LevelsPage from './lessons/levelsPage'; // Import LevelsPage component
import Leaderboard from './Leaderboard.js';
import FAQ from './FAQ.js';


function App() {
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState(0);  // Points state added
  const { loggedIn, setLoggedIn } = LoggedIn();

  // Helper function to handle logged-in redirects
  const ProtectedRoute = ({ children }) => {
    return loggedIn ? children : <Navigate replace to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Route for login page */}
        <Route
          path="/"
          element={
            <Login
              setLoggedIn={setLoggedIn}
              setUsername={setUsername}
              setDisplayName={setDisplayName}
              setProfilePicture={setProfilePicture}
            />
          }
        />

        {/* Public About route */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Protected Routes */}
        <Route
          path="/MyProfilePage"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/home"
          element={
          
              <HomeScreen />
        
          }
        />

        {/* MainScreen route */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          }
        />

        {/* LevelsPage route */}
        <Route
          path="/levels"
          element={
            <ProtectedRoute>
              <LevelsPage points={points} username={username} />
            </ProtectedRoute>
          }
        />

        {/* Lesson route */}
        <Route
          path="/lesson/:level"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />
         {/* New Lesson2 route */}
        <Route
          path="/lesson2/:word"
          element={
            <ProtectedRoute>
              <Lesson2 />
            </ProtectedRoute>
          }
        />
         <Route
          path="/lesson3/:word"
          element={
            <ProtectedRoute>
              <Lesson3 />
            </ProtectedRoute>
          }
        />
          <Route
          path="/lesson4/:sentence"
          element={
            <ProtectedRoute>
              <Lesson4 />
            </ProtectedRoute>
          }
        />
        <Route path="/alphabet-image" element={<AlphabetImage />} />
        <Route path="/Level2" element={<Level2 />} />
        <Route path="/Level3" element={<Level3 />} />
        <Route path="/Level4" element={<Level4 />} />

        <Route path="/levels26" element={<Levels />} />
        <Route path="/achive" element={<Leaderboard />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/sign-word" element={<SignWordSearch />} />


        <Route path="/lesson/:letter" element={<Lesson />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;