import React, { useState, useEffect, useRef } from 'react';
import './MyProfilePage.css';
import { useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import RightSide from "./RightPanel";



function FriendPage() {
    const [mode, setMode] = useState(true);
    const location = useLocation();
    const { state } = location;
    const { username, token, _isFriend } = state;
    const [pic, setPic] = useState('');
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
    const [isFriend, setIsFriend] = useState(_isFriend);
    console.log("hellasdasldad", username, isFriend);

    const modalRef = useRef(null);
    


    const handleImageUpload = (image) => {
        setImage(image);
    };

    
    const handleEditProfilePicture = async (image) => {
        let imageData = '';

        // Check if image is provided

        // Read the image file using FileReader
        const reader = new FileReader();

        reader.onloadend = () => {
            // Store the base64 string in the imageData variable
            imageData = reader.result;

            // Call the function to update the profile picture
            updateProfilePicture(imageData);
        };

        // Convert the image file to base64
        reader.readAsDataURL(image);

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
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUserData();
    }, []);

    const updateProfilePicture = async (imageData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({
                    profilePic: imageData,
                }),
            });

            if (response.ok) {
                setImage(imageData)

                // Update the profile picture in the state
                await setImage(imageData)

                setShowModal(false); // Close the modal after successful update
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
    }, [displayName, username, image, mode, token]);

    const sendToServer = async (friend) => {
        const res = await fetch('http://localhost:5000/api/Users/' + friend + "/friends", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "bearer " + token,
            }
        });
        const data = await res.json();
        if (data === null) {
            console.log("error");
        }
        setIsFriend(true)
    }

    return (
        <div className="container">
            <div className="profile-details">
                <div className="profile-header">
                    <img
                        src={image}
                        alt="Profile Image"
                        className={"Logo profile-image"}
                        onClick={() => setShowModal(true)}
                        style={{ width: "100%", height: "20%" }}
                    />
                    <div>
                        {username}
                    </div>
                    {isFriend ? (
                        <></>
                    ) : (
                        <button onClick={() => sendToServer(username)}> add friend </button>
                    )
                    }
                </div>
            </div>

            
        </div>
    );
}
export default FriendPage;
