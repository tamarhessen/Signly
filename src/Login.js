
import React, {useState, useRef, useEffect, useCallback} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import './Login.css';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, getDisplayName, getProfilePicture } from './Users';

function Login({setLoggedIn}) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loginError, setLoginError] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    const isUserAuthenticated = authenticateUser(username, password);
    
    if (isUserAuthenticated) {
  
    // Retrieve the display name and profile picture from the registered user's data
  const displayNameValue=getDisplayName(username);
  setLoggedIn(true);
  console.log("setloggedin", setLoggedIn)
  const profilePictureValue=getProfilePicture(username);
    // Navigate to the feed screen
    navigate('/feed', { state: { displayName: displayNameValue, profilePicture: profilePictureValue} });
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

  return (
    <div className='login-page'>
      <div className="welcome-text">
        <h2>facebook</h2>
      </div>
      <div className="additional-info">
        <p>Facebook helps you connect and share</p>
        <p>with the people in your life.</p>
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
              <button type="submit" className="button-blue">Log In</button>
              {loginError && <p className="error-message">{loginError}</p>}
            </form>
          </div>
        </div>
        <div className="button-container">
          <div className="forgot-password">
            <a href="#">Forgotten password?</a>
          </div>
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