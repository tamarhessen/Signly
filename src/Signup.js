import React, { useState } from 'react';
import './signup.css'; // New CSS file for styling
import { useNavigate } from 'react-router-dom'; 
import Form from "react-bootstrap/Form";

import { isUsernameEqual } from './Users'; // Import registerUser function

function Signup({ handleCloseSignupModal }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [pic, setPic] = useState('');
  const [realPic, setRealPic] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to reset the form fields
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setRealPic(null);
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
  function showPic(event) {
    const file = event.target.files[0];
    setRealPic(file);
    if (file) {
      // Convert the selected image to a base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setPic(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPic('');
    }
  }
// Function to convert blob to base64 string
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
  // Handle form submission
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
   if (realPic===null) {
     errors.realPic = 'Profile picture is required';
   }
   if(isUsernameEqual(username)){
     errors.username = "This username name is taken"
         }
        
   // Display errors if any
   setErrors(errors);
 
   if (Object.keys(errors).length === 0) {
  try {
    // Resize the image before uploading
    const resizedPic = await resizeImage(realPic);
    // Convert the resizedPic blob to a base64 string
    const profilePic = await blobToBase64(resizedPic);
    // Create the user object with the base64 string
    const newUser = {
      username,
      password,
      displayName,
      profilePic // Assign the base64 string to profilePic
    };

    // Post user to server
    const res = await fetch('http://localhost:5000/api/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });

    if (res.status !== 200) {
      setErrors({...errors, username: {message: "Username already exists or picture too large.", invalid:1}});
      return;
    }

    resetForm();
    handleCloseSignupModal();
  } catch (error) {
    console.error('Error registering user:', error);
    setErrors((prevErrors) => ({
      ...prevErrors,
      server: 'Failed to register user. Please try again later.',
    }));
  }}
};

  // Function to resize the image
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            'image/jpeg',
            0.7
          );
        };
      };
    });
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
          {errors.username && <span className="error-message">{errors.username.message}</span>}
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
          {errors.password && <span className="error-message">{errors.password.message}</span>}
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
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={handleDisplayNameChange}
            className={errors.displayName ? 'input-error' : ''}
          />
          {errors.displayName && <span className="error-message">{errors.displayName.message}</span>}
        </div>
        <Form.Group className="mb-3">
                            <Form.Label className="form-label">
                                Picture
                            </Form.Label>
                            <Form.Control className="form-control" type="file" id="formFile"
                                          onChange={showPic} name="image" accept="image/*"
                            />
                            {pic === '' &&
                                <div id="formFile" className="form-text text-muted">
                                    If no profile picture is provided a default picture will be used.
                                </div>}
                        </Form.Group>
                        <div className="img-cont">
                            <img
                                src={pic}
                                id="Profile-Picture"
                                alt="Profile Picture"
                            />
                        </div>
                        <br/>
        
        <p className="terms">
          By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
        </p>
        <button type="submit" className="signup-btn green-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;


