import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import FeedScreen from './feed/FeedScreen';

import About from './About'; // Import the About component


import 'bootstrap/dist/css/bootstrap.min.css';

import { Modal } from 'bootstrap';
import './Login.css';
import { authenticateUser } from './Users';
import { LoggedIn } from './loggedIn';
import MyProfilePage from './feed/MyProfilePage';
import FriendPage from './feed/FriendPage';

import MainScreen from './feed/MainScreen'; // Import MainScreen (updated path)
import Lesson from './lessons/Lesson'; // Import Lesson component (updated path)

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const { loggedIn, setLoggedIn } = LoggedIn();

  // Helper function to handle logged-in redirects
  const ProtectedRoute = ({ children }) => {
    return loggedIn ? children : <Navigate replace to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Route for login page */}
        <Route path="/" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} setDisplayName={setDisplayName} setProfilePicture={setProfilePicture} />} />

        {/* Public About route */}

        <Route path="/about" element={<About />} />


        {/* Protected Routes */}
        <Route path="/MyProfilePage" element={<ProtectedRoute><MyProfilePage displayName={displayName} username={username} profilePicture={profilePicture} /></ProtectedRoute>} />
        <Route path="/FriendPage" element={<ProtectedRoute><FriendPage /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><FeedScreen setLoggedIn={setLoggedIn} username={username} displayName={displayName} profilePicture={profilePicture} /></ProtectedRoute>} />

        {/* MainScreen route */}
        <Route path="/main" element={<ProtectedRoute><MainScreen setLoggedIn={setLoggedIn} username={username} displayName={displayName} profilePicture={profilePicture} /></ProtectedRoute>} />

        {/* Lesson route */}
        <Route path="/lesson" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />


        {/* Catch-all route */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
