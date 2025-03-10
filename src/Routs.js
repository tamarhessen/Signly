import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import HomeScreen from './home/HomeScreen';

function App() {
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login setDisplayName={setDisplayName} setProfilePicture={setProfilePicture} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomeScreen displayName={displayName} profilePicture={profilePicture} />} />
      </Routes>
    </Router>
  );
}

export default App;
