import React, { useState, useEffect, useRef } from 'react';
import './MyProfilePage.css';
import { useLocation } from 'react-router-dom';
import PostList from './Posts';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LeftSide from "./MainLeft"
import MainFeedCenter from "./MainFeedCenter";
import RightSide from "./MainRight";
import Post from "./Post";


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
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [shiftDown, setShiftDown] = useState(false);
    const [show, setShow] = useState(false);
    const textRef = useRef("");
    const imgRef = useRef("");
    const [isFriend, setIsFriend] = useState(_isFriend);
    console.log("hellasdasldad", username, isFriend);

    const modalRef = useRef(null);
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${username}/posts`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if (response.ok) {
                    const posts = await response.json();
                    console.log(posts)
                    setPosts(posts.map((post, index) => ({
                        id:post["id"],
                        text: post["PostText"],
                        PeopleLiked: post["PeopleLiked"],
                        likes: post[" PostLikes"],
                        time: post["created"],
                        comments: post.commentsList,
                        image: post["PostImg"],
                        userImg: image,
                        account:post["Creator"]

                    } )));
                } else {
                    console.error('Failed to fetch user posts');
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [username, token]);
// Load liked status and number of likes from localStorage when component mounts
    useEffect(() => {
        const savedLikes = JSON.parse(localStorage.getItem('likes')) || {};
        setPosts(posts => posts.map(post => ({
            ...post,
            liked: savedLikes[post.id] ? savedLikes[post.id].liked : false,
            likes: savedLikes[post.id] ? savedLikes[post.id].likes : post.likes
        })));
    }, []);

// Save liked status and number of likes to localStorage whenever posts state changes
    useEffect(() => {
        const updatedLikes = {};
        posts.forEach(post => {
            updatedLikes[post.id] = { liked: post.liked, likes: post.likes };
        });
        localStorage.setItem('likes', JSON.stringify(updatedLikes));
    }, [posts]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAddPost = async (text, image) => {
        let d = new Date();
        let time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        let imageData = '';
        if (image) {
            // Read the image file using FileReader
            const reader = new FileReader();

            reader.onloadend = () => {
                // Store the base64 string in the imageData variable
                imageData = reader.result;

                // Call the API to add the post with the text and base64 image data
                addPost(text, imageData);
            };

            // Convert the image file to base64
            reader.readAsDataURL(image);
        } else {
            // If no image is provided, call the API to add the post without an image
            addPost(text, '');
        }
    };

    const addPost = async (text, imageData) => {
        console.log(imageData);
        let d = new Date();
        let time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        try {
            const data = {
                postText: text,
                postImg: imageData // Send the base64 image data to the server
            };

            const response = await fetch(`http://localhost:5000/api/users/${username}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Post saved successfully, update the state with the new post
                const newPost = await response.json();
                setPosts(prevPosts => [{
                    id: newPost.id,
                    text: text.trim(),
                    PeopleLiked: newPost.PeopleLiked,
                    likes: 0,
                    time: time,
                    comments: [],
                    image: newPost.image,
                    userImg: image,
                    username: username,
                    account: newPost.Creator
                }, ...prevPosts]);
            } else {
                // Handle error if saving post fails
                console.error('Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };


    const handleChangePost = (newPost, oldPost) => {

    }
    const handleRemovePost = async (id) => {
        console.log('Deleting post with id:', id);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${username}/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });

            if (response.ok) {
                // Remove the post from the state
                setPosts(posts.filter(post => post.id !== id));
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }

    };

    const handleLikePost = async (id) => {

        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        let { liked } = updatedPosts[index];

        liked = !liked;
//     if(liked==false)
//     likes=likes-1;
// else
// likes=likes+1;

        try {
            console.log("aa");
            const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (response.ok) {
                const updatedPosts = [...posts];
                const index = updatedPosts.findIndex((post) => post.id === id);
                updatedPosts[index].liked = !updatedPosts[index].liked;
                setPosts(updatedPosts);
            } else {
                console.error('Failed to update like status');
            }
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };




    const handleAddComment = (id, comment) => {
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        console.log(posts)
        let com = updatedPosts[index].comments;
        let id2 = 0;
        console.log("hola", com);
        if (com.length !== 0) {
            id2 = com[com.length - 1].id + 2;
        }
        let commentData = {
            comment: comment,
            username: username,
            userImg: image,
            id: id2
        }
        updatedPosts[index].comments.push(commentData);
        console.log(commentData, updatedPosts[index].comments);
        setPosts(updatedPosts);
        console.log(posts[index]);
    };

    const handleEditPost = async (id, text, image) => {
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        let imageData = '';

        // Check if image is provided
        if (image) {
            // Read the image file using FileReader
            const reader = new FileReader();

            reader.onloadend = () => {
                // Store the base64 string in the imageData variable
                imageData = reader.result;

                // Call the API to update the post with the new text and base64 image data
                updatePost(id, text, imageData);
            };

            // Convert the image file to base64
            reader.readAsDataURL(image);
        } else {
            // If no image is provided, update the post with only the new text
            updatePost(id, text, '');
        }
    };

    const updatePost = async (id, text, imageData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${username}/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    postText: text,
                    postImg: imageData // Send the base64 image data to the server
                })
            });

            if (response.ok) {
                // Post updated successfully, update the state with the updated post
                const updatedPost = await response.json();
                const updatedPosts = [...posts];
                const index = updatedPosts.findIndex((post) => post.id === id);
                updatedPosts[index].text = text;
                updatedPosts[index].image = imageData; // Update the image URL in the state
                setPosts(updatedPosts);
            } else {
                // Handle error if updating post fails
                console.error('Failed to edit post');
            }
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };


    const handleImageUpload = (image) => {
        setImage(image);
    };

    const handleDeleteComment = (postId, comment, comments) => {
        if (comments !== undefined || comments != null) {
            console.log("delete - comments is not null")
        }
        else {
            console.log("comments: ", comments);
        }
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === postId);
        let filteredComments = updatedPosts[index].comments;
        if (comment.id !== -1) {
            console.log("helloooooooo", comment)
            filteredComments = updatedPosts[index].comments.filter(com => com.id !== comment.id);
        } else {
            console.log("helloooooooo");
            filteredComments = comments;
        }
        console.log("idddd", comment.id, filteredComments)
        updatedPosts[index].comments = filteredComments;
        setPosts(updatedPosts);
        console.log(posts[index]);
        return filteredComments;
    }
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

            <div className="posts-container">
                <div className="posts">
                    <>
                        <div>
                            {posts.length === 0 ? (
                                <p>You are not friends or the user doesn't have any posts.</p>
                            ) : (
                                <>
                                    {posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            id={post.id}
                                            text={post.text}
                                            PeopleLiked={post.PeopleLiked}
                                            likes={post.likes}
                                            _comments={post.comments}
                                            image={post.image}
                                            time={post.time}
                                            onLike={() => handleLikePost(post.id)}
                                            onRemove={() => handleRemovePost(post.id)}
                                            username={username}
                                            userImage={image}
                                            account={""}
                                            onAddComment={(comment) => handleAddComment(post.id, comment)}
                                            onDeleteComment={(comment, comments) => handleDeleteComment(post.id,comment, comments)}
                                            onEdit={(newText, newImg) => handleEditPost(post.id, newText, newImg)}
                                            mode={mode}
                                            setLikes={setLikes}
                                            displayName={displayName}
                                            token={token}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}
export default FriendPage;
