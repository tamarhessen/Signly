import React, { useState, useRef } from 'react';
import './signup.css'; // New CSS file for styling
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from './Users'; // Import registerUser function
import { isUsernameEqual } from './Users'; // Import registerUser function


function Signup({ handleCloseSignupModal}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate hook
  // Global array to store user registration details


  // Function to reset the form fields
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setProfilePicture(null);
    setErrors({});
  };
  // Handle username change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle display name change
  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  // Handle profile picture selection
 // Handle profile picture selection
const handleProfilePictureChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfilePicture(file);
  } else {
    setProfilePicture(null); // Reset profile picture if no file is selected
  }
};

  // Handle capturing picture from camera
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setProfilePicture(blob);
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 5000); // Stop recording after 5 seconds
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

 
    // Validation
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!displayName.trim()) {
      errors.displayName = 'Display name is required';
    }
    if (profilePicture===null) {
      errors.profilePicture = 'Profile picture is required';
    }
    if(isUsernameEqual(username)){
      errors.username = "This username name is taken"
          }
         
    // Display errors if any
    setErrors(errors);
  
    if (Object.keys(errors).length === 0) {
     // Example usage of registerUser function;
      const userData = {username, password, displayName, profilePicture };
      
      registerUser(userData);
      resetForm();
     handleCloseSignupModal();
     
   
    }
   
  };


  return (
   <div className="signup-container">
  <button type="button" className="close-button" onClick={resetForm} data-bs-dismiss="modal">X</button>
  <div className="signup-header">
    <h2>Sign Up</h2>
    <p>It's quick and easy.</p>
  </div>
  <form className="signup-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <input
        type="text"
        id="Username-signup"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        className={errors.username ? 'input-error' : ''}
      />
      {errors.username && <span className="error-message">{errors.username}</span>}
    </div>
    <div className="form-group">
      <input
        type="password"
        id="Password-signup"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className={errors.password ? 'input-error' : ''}
      />
      {errors.password && <span className="error-message">{errors.password}</span>}
      {!errors.password && (
        <p className="password-requirement">Password must be at least 8 characters long</p>
      )}
    </div>
    <div className="form-group">
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        className={errors.confirmPassword ? 'input-error' : ''}
      />
      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
    </div>
    <div className="form-group">
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={handleDisplayNameChange}
        className={errors.displayName ? 'input-error' : ''}
      />
      {errors.displayName && <span className="error-message">{errors.displayName}</span>}
    </div>
    <div className="form-group">
      <label htmlFor="profile-picture">Profile Picture:</label>
      <input
        type="file"
        id="profile-picture"
        accept="image/*"
        onChange={handleProfilePictureChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>Upload from Computer</button>
      <button type="button" className="take-picture-btn" onClick={handleCameraCapture}>Take Picture</button>
      {/* Display error message for profile picture */}
      {errors.profilePicture && <span className="error-message">{errors.profilePicture}</span>}
    </div>
    {profilePicture && (
      <div className="preview">
        <img src={URL.createObjectURL(profilePicture)} alt="Profile" />
      </div>
    )}
    <p className="terms">
          By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
        </p>
        <button type="submit" className="signup-btn green-btn">Sign Up</button>
  </form>
</div>

   
  );
}

export default Signup; 