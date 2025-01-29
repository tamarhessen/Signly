// App.js
import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import FeedScreen from './feed/FeedScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import './Login.css';
import { authenticateUser } from './Users';
import {LoggedIn} from "./loggedIn";
import MyProfilePage from './feed/MyProfilePage';
import FriendPage from "./feed/FriendPage";

function App() {
  const [displayName, setDisplayName] = useState(''); 
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  let {loggedIn, setLoggedIn} = LoggedIn();
  let abc = "abc"
  return (
    <Router>
      <Routes>
        {/* Pass setUsername and setProfilePicture as props */}
        <Route path="/" element={<Login setLoggedIn={setLoggedIn} setUsername={username}setDisplayName={setDisplayName} setProfilePicture={setProfilePicture} />} />
        { loggedIn ? (
        <Route path="/MyProfilePage" element={<MyProfilePage displayName={displayName}username={username} profilePicture={profilePicture}/>} />
        ) : (
            <Route path='/MyProfilePage' element={<Navigate replace to={"/"}/>} />
        )}
        { loggedIn ? (
        <Route path="/FriendPage" element={<FriendPage/>} />
          ) : (
          <Route path='/FriendPage' element={<Navigate replace to={"/"}/>} />
          )}
        { loggedIn ? (
              <Route path="/feed" element={<FeedScreen setLoggedIn={setLoggedIn} username={username}displayName={displayName} profilePicture={profilePicture} />} />
          ) : (
              <Route path='/feed' element={<Navigate replace to={"/"}/>} />
          )}
        {/* Other routes */}
        <Route path="*" element={<Navigate replace to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;