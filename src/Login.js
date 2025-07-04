import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import './Login.css';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { getProfilePicture } from './Users'; // Import getProfilePicture function
import logo from './logo.png'; // נתיב ישיר לתמונה בתוך תיקיית src
import backgroundImage from './background.png';

function Login({ setLoggedIn }) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  useEffect(() => {
    // Clear localStorage when the Login page is loaded
    localStorage.clear();  // This will remove all the stored items in localStorage
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password
    };

    // check if user exists - if it exists, get the token.
    const res = await fetch('http://localhost:5000/api/Tokens', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (res.status === 200) { // OK - user exists
      const token = await res.text();
      console.log(token);
      // get user info.
      const res2 = await fetch('http://localhost:5000/api/Users/' + username, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'authorization': "bearer " + token,
        }
      });
      const json2 = await res2.json();
      const displayNameValue = json2.displayName;
      const profilePictureValue = json2.profilePic;
      setLoggedIn(true);
   
      navigate('/home', { state: { username: username, displayName: displayNameValue, profilePictureURL: profilePictureValue, token: token } });
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleCreateAccount = () => {
    modalRef.current.show();
    setShowSignupModal(true);
  };

  const handleCloseSignupModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.hide(); // Remove the modal element from the DOM
    }
    setShowSignupModal(false); // Update the state to reflect the modal being closed
  };

  useEffect(() => {
    modalRef.current = new Modal(document.getElementById('signupModal'), {});
  }, []);

  useEffect(() => {
    if (showSignupModal) {
      modalRef.current.show();
    }
  }, [showSignupModal]);

  // Fetch profile picture URL when the component mounts or when username changes
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (username) {
        try {
          const profilePictureValue = await getProfilePicture(username); // Assuming getProfilePicture fetches the picture URL based on the username
          setProfilePictureURL(profilePictureValue);
        } catch (error) {
          console.error("Error fetching profile picture:", error);
          // Handle error here, e.g., set a default profile picture or show an error message
        }
      }
    };
  
    fetchProfilePicture();
  }, [username]);

  return (
    <div className="login-page">
      <div className="background-blur"></div> {/* רקע מטושטש */}
  
      <div className="welcome-text">
        <img src={logo} alt="SIGNLY Logo" className="logo" />
        {/* <h2>SIGNLY</h2> */}
      </div>
      <div className="additional-info">
        <p>Learn sign language through interaction and fun!</p>
      </div>
      <div className='sign-in-container'>
        <div className="username-password-container">
          <div className="username-password-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className="blue-button">Log In</button >
              {loginError && <p className="error-message">{loginError}</p>}
            </form>
          </div>
        </div>
        <div className="button-container">
          <div className="SignUp">
            <button type="button" className="green-button" onClick={handleCreateAccount}>Create new account</button>
          </div>
        </div>
      </div>
      <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <Signup handleCloseSignupModal={handleCloseSignupModal}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
