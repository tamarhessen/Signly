import React, { useState, useEffect, useRef } from 'react';
import './MyProfilePage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import RightSide from "./RightPanel";
import TopPanel from './TopPanel';
import Footer from './Footer';


function MyProfilePage() {
  const [mode, setMode] = useState(true);
  const location = useLocation();
  const { state } = location;
  const {username,userImg, token } = state || {};  // Ensure state is not undefined
  const [pic, setPic] = useState(userImg || '/default-profile.jpg');
  const [displayName, setDisplayName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [realPic, setRealPic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditWindow, setShowEditWindow] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState('');
  const [image, setImage] = useState(undefined);
  const [shiftDown, setShiftDown] = useState(false);
  const [show, setShow] = useState(false);
  const textRef = useRef("");
  const imgRef = useRef("");
  const navigate = useNavigate();
  const logout = () => {
    // ניקוי נתוני המשתמש ב-localStorage או ב-cookie
    localStorage.removeItem("token"); // או אם משתמש ב-cookie
    // ינתב מחדש לדף הבית או דף ההתחברות
    navigate("/login");
  };
  
  

  const modalRef = useRef(null);

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const MAX_WIDTH = 900;
                    const MAX_HEIGHT = 900;
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
                        0.8
                    );
                };
            };
        });
    };



const handleClose = () => setShow(false);
const handleShow = () => setShow(true);


const handleEditProfilePicture = async (file) => {
  if (!file) return; // Ensure a file exists
  const compressedImage = await resizeImage(file); // Resize the image first

  const reader = new FileReader();
  reader.onloadend = () => {
    const imageData = reader.result; // This will give you a base64 string
    updateProfilePicture(imageData);
  };
  reader.readAsDataURL(compressedImage); // Convert the compressed image to base64
};

  // Function to fetch user data from the server
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User Data:', userData); // Log the userData object

        setDisplayName(userData.displayName); // Set the displayName separately
        setPassword(userData.password);
       setImage(userData.profilePic);

        console.log("sssss" + displayName);

      } else {
        console.error('Failed to fetch user data');
        console.log('Token:', token);

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  const updateProfilePicture = async (imageData2) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          profilePic: imageData2,
        }),
      });

      if (response.ok) {
        setImage(imageData2)

        // Update the profile picture in the state
        await setImage(imageData2)

        setShowModal(false); // Close the modal after successful update
        logout();
      } else {
        // Handle error if updating profile picture fails
        console.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Update the state to close the modal
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

  const handleOpenEditWindow = () => {
    setShowEditWindow(true);
    setEditedDisplayName(displayName);
  };

  const handleCloseEditWindow = () => {
    setShowEditWindow(false);
  };

  const handleDisplayNameChange = (event) => {
    setEditedDisplayName(event.target.value);
  };

  const handleSaveDisplayName = async() => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          displayName: editedDisplayName,
        }),
      });
      console.log("response", response)
      if (response.ok) {
        // Update the display name in the state
        setDisplayName(editedDisplayName);
        setAccount(editedDisplayName);
        setShowEditWindow(false);
        logout();
      } else {
        console.error('Failed to update display name');
      }
    } catch (error) {
      console.error('Error updating display name:', error);
    }
  };
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Update key whenever any of the props change
    setKey(prevKey => prevKey + 1);
  }, [displayName, username, userImg, mode, token]);
    const handleDelete = async () => {
        const response = await fetch(`http://localhost:5000/api/users/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        })
        console.log(response)
        navigate("/");
    }
    return (
      <div className="page-wrapper">
        <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />
    
        <div className="profile-details">
          <div className="profile-header">
            <img
              src={userImg}
              alt="Profile Image"
              className={"Logo profile-image"}
              onClick={() => setShowModal(true)}
              style={{ width: "100%", height: "100%" }}
            />
            {showEditWindow ? (
              <div>
                <input
                  type="text"
                  value={editedDisplayName}
                  onChange={handleDisplayNameChange}
                />
                <button onClick={handleSaveDisplayName}>Save</button>
                <button onClick={handleCloseEditWindow}>Cancel</button>
              </div>
            ) : (
              <div>
                <h1>{displayName}</h1>
                <button onClick={handleOpenEditWindow} className="bb-button">Edit Display name</button>
                <button onClick={handleDelete} className={"btn btn-danger"}>Delete user</button>
                <button onClick={logout} className="btn btn-warning">Logout</button>
              </div>
            )}
          
          </div>
          </div>
          <Footer />
      
        
    
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Picture</Form.Label>
              <Form.Control
                className="form-control"
                type="file"
                id="formFile"
                onChange={showPic}
                name="image"
                accept="image/*"
              />
            </Form.Group>
            <div className="img-cont">
              <img src={pic} id="Profile-Picture" alt="Profile Picture" />
            </div>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleEditProfilePicture(realPic)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    );
    
          }
          
export default MyProfilePage;
