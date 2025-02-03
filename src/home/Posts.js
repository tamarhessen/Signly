import React, { useEffect, useRef, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import postsData from "./Posts.json";
import {ModalDialog} from "react-bootstrap";

function PostList({ username,displayName, userImg, mode,token }) {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [image, setImage] = useState(undefined);
    const [shiftDown, setShiftDown] = useState(false);
    const [show, setShow] = useState(false);
    const textRef = useRef("");
    const imgRef = useRef("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const staticPosts = JSON.parse(JSON.stringify(postsData))
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

                displayName=userData.displayName;
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
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/posts`, {
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
                        userImg: post["CreatorImg"],
                        account: post["Creator"],
                        creatorUsername: post["CreatorUsername"],
                        token: token
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
    // useEffect(() => {
    //     // Load posts from Posts.json
    //     setPosts(Object.keys(staticPosts).map((postName, index) => {
    //         const post = staticPosts[postName];
    //         console.log(post["post-image"])
    //         return {
    //             id: index + 1,
    //             text: post["post-text"],
    //             liked: post.liked,
    //             likes: post.likes,
    //             time: post.time,
    //             comments: post.commentsList,
    //             image: post["post-image"],
    //             username: post.username,
    //             userImg: post["user-image"],
    //             account: username
    //         };
    //     }));
    // }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
    const handleAddPost = async (text, image) => {
        console.log("asגשדגשדגשדגשדגשגשדג")
        let d = new Date();
        let time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        let imageData = '';

        try {
            if (image) {
                // Compress the image before uploading
                const compressedImage = await resizeImage(image);
                // Convert the compressed image blob to base64
                const reader = new FileReader();
                reader.readAsDataURL(compressedImage);
                reader.onloadend = () => {
                    // Store the base64 string in the imageData variable
                    imageData = reader.result;
                    // Call the API to add the post with the text and base64 image data
                    console.log("aloha")
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
                console.log(newPost)
                setPosts(prevPosts => [{
                    id: newPost.id,
                    text: text.trim(),
                    PeopleLiked: newPost.PeopleLiked,
                    likes: 0,
                    time: time,
                    comments: [],
                    image: image,
                    userImg: userImg,
                    username: username,
                    account: displayName,
                    creatorUsername: username
                }, ...prevPosts]);
            } else {
                // Handle error if saving post fails
                setErrorMessage("Couldn't create a post. Try again later.");
                setShowErrorMessage(true);
            }
        } catch (error) {
            setShowErrorMessage(true);
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
        console.log("asdasdasdasdasdasd", id, comment)
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        console.log(posts)
        let com = updatedPosts[index].comments;
        let id2 = 0;
        console.log("hola", com);
        if (com) {
            if (com.length !== 0) {
                id2 = com[com.length - 1].id + 2;
            }
        }
        let commentData = {
            comment: comment,
            username: username,
            userImg: userImg,
            id: id2
        }
        console.log(updatedPosts[index])
        if(updatedPosts[index].comments) {
            updatedPosts[index].comments.push(commentData);
        } else {
            updatedPosts[index].comments = [commentData];
        }
        console.log(commentData, updatedPosts[index].comments);
        setPosts(updatedPosts);
        console.log(posts[index]);
    };

    const handleEditPost = async (id, text, image) => {
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        let imageData = '';
        console.log("image", image)
        // Check if image is provided
        if (image) {
            // Read the image file using FileReader
            const compressedImage = await resizeImage(image);
            const reader = new FileReader();
            try {
                reader.readAsDataURL(compressedImage);
            } catch (e) {
                console.log("error: ", e)
            }

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
                setErrorMessage("");
            } else {
                // Handle error if updating post fails
                setErrorMessage("Couldn't edit a post. Try again later.");
                setShowErrorMessage(true);

            }
        } catch (error) {
            setErrorMessage("Couldn't edit a post. Try again later.");
            setShowErrorMessage(true);
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
    posts.map((post) => {
        console.log(post)
    })
    console.log("usernameeee", username, displayName);
    return (
        <>
            <div>
                <div className={"uploadPost post-container"} onClick={handleShow}>
                    <img src={userImg} className={"Logo"} />
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
                            userImage={post.userImg}
                            account={displayName}
                            onAddComment={(comment) => handleAddComment(post.id, comment)}
                            onDeleteComment={(comment, comments) => handleDeleteComment(post.id,comment, comments)}
                            onEdit={(newText, newImg) => handleEditPost(post.id, newText, newImg)}
                            mode={mode}
                            setLikes={setLikes}
                            displayName={post.account}
                            creatorUsername={post.creatorUsername}
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
                                    const image = e.target.files[0];
                                    handleImageUpload(image);
                                }}
                            />
                            {image && <img src={URL.createObjectURL(image)} alt="Preview" className={"image"} />}
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
            <Modal show={showErrorMessage} onHide={() => setShowErrorMessage(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowErrorMessage(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PostList;
