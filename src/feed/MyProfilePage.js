import React, { useState, useEffect, useRef } from 'react';
import './MyProfilePage.css';
import {useLocation, useNavigate} from 'react-router-dom';
import PostList from './Posts';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LeftSide from "./MainLeft"
import MainFeedCenter from "./MainFeedCenter";
import RightSide from "./MainRight";
import Post from "./Post";


function MyProfilePage() {
  const [mode, setMode] = useState(true);
  const location = useLocation();
  const { state } = location;
  const { username, userImg, token } = state;
  const [pic, setPic] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [realPic, setRealPic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditWindow, setShowEditWindow] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState('');
  const [image, setImage] = useState(undefined);
  const [postImg, setPostImg] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [shiftDown, setShiftDown] = useState(false);
  const [show, setShow] = useState(false);
  const textRef = useRef("");
  const imgRef = useRef("");
  const navigate = useNavigate();
  

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

    const handleAddPost = async (text, image2) => {
        console.log("asגשדגשדגשדגשדגשגשדג", text, image2);
        let d = new Date();
        let time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        let imageData = '';

        try {
            if (image2) {
                // Compress the image before uploading
                const compressedImage = await resizeImage(image2);
                // Convert the compressed image blob to base64
                const reader = new FileReader();
                reader.readAsDataURL(compressedImage);
                reader.onloadend = () => {
                    // Store the base64 string in the imageData variable
                    imageData = reader.result;
                    // Call the API to add the post with the text and base64 image data
                    console.log("aloha")
                    console.log(text, imageData);
                    addPost(text, imageData);
                };
            } else {
                // If no image is provided, call the API to add the post without an image
                addPost(text, '');
            }
        } catch (error) {
            console.error('Error compressing image:', error);
            // If there's an error compressing the image, proceed to add the post without the image
            addPost(text, '');
        }
    };


const addPost = async (text, imageData) => {
    if (!text && !imageData) {
        return
    }
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
                image: postImg,
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
        userImg: userImg,
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
            const compressedImage = await resizeImage(image);
            const reader = new FileReader();
            reader.readAsDataURL(compressedImage);

            reader.onloadend = () => {
                // Store the base64 string in the imageData variable
                imageData = reader.result;

                // Call the API to update the post with the new text and base64 image data
                updatePost(id, text, imageData);
            };

            // Convert the image file to base64
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


const handleImageUpload = (postImg) => {
    console.log(postImg);
    console.log()
    setPostImg(postImg);
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
      const compressedImage = await resizeImage(image);
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);

      reader.onloadend = () => {
        // Store the base64 string in the imageData variable
        imageData = reader.result;

        // Call the function to update the profile picture
        updateProfilePicture(imageData);
      };

      // Convert the image file to base64
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
              <button onClick={handleOpenEditWindow}>Edit Display name</button>
                <button onClick={handleDelete} className={"btn btn-danger"}>Delete user</button>
            </div>
          )}
        </div>
      </div>
  
      <div className="posts-container">
        <div className="posts">
        <>
            <div>
                <div className={"uploadPost post-container"} onClick={handleShow}>
                    <img src={image} className={"Logo"} />
                    <span>{"What's on your mind " + displayName + "?"}</span>
                </div>
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
                            account={displayName}
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
            </div>
            <Modal show={show} onHide={handleClose}>
                <div className={mode ? "light-mode" : "night-mode"}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <>
                        <textarea
                            ref={textRef}
                            // type="text-box"
                            placeholder={"What's on your mind " + username + "?"}
                            className={"input"}
                            // className={"input"}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !shiftDown) {
                                    const text = e.target.value;
                                    const image = e.target.nextElementSibling.files[0];
                                    handleAddPost(text, image);
                                    handleImageUpload('');
                                    handleClose()
                                    e.target.value = '';
                                    e.target.nextElementSibling.value = '';
                                } else if (e.key === 'Shift') {
                                    setShiftDown(true)
                                }
                            }}
                            onKeyUp={(e) => {
                                if (e.key === 'Shift') {
                                    setShiftDown(false)
                                }
                            }}
                        />
                            <input
                                ref={imgRef}
                                id={"imageInput"}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const image3 = e.target.files[0];
                                    handleImageUpload(image3);
                                }}
                            />
                            {postImg && <img src={URL.createObjectURL(postImg)} alt="Preview" className={"image"} />}
                        </>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => {
                            const text = textRef.current.value;
                            const image = imgRef.current.files[0];
                            handleAddPost(text, image);
                            handleImageUpload('');
                            handleClose()
                        }}>
                            Add Post
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
        </div>
      </div>
  
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
          <Button
            variant="primary"
            onClick={() => handleEditProfilePicture(realPic)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
          }
export default MyProfilePage;
