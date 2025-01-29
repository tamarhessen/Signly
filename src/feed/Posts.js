import React, { useEffect, useRef, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import postsData from "./Posts.json";
import {ModalDialog} from "react-bootstrap";

function PostList({ username, userImg, mode }) {
    const [posts, setPosts] = useState([]);
    const [image, setImage] = useState(undefined);
    const [shiftDown, setShiftDown] = useState(false);
    const [show, setShow] = useState(false);
    const textRef = useRef("");
    const imgRef = useRef("");
    const staticPosts = JSON.parse(JSON.stringify(postsData))

    useEffect(() => {
        // Load posts from Posts.json
        setPosts(Object.keys(staticPosts).map((postName, index) => {
            const post = staticPosts[postName];
            console.log(post["post-image"])
            return {
                id: index + 1,
                text: post["post-text"],
                liked: post.liked,
                likes: post.likes,
                time: post.time,
                comments: post.commentsList,
                image: post["post-image"],
                username: post.username,
                userImg: post["user-image"],
                account: username
            };
        }));
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAddPost = (text, image) => {
        let d = new Date();
        let time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
        if (text.trim() !== '' || image) {
            setPosts(prevPosts =>[{
                id: Date.now(),
                text: text,
                liked: false,
                likes: 0,
                time: time,
                comments: [],
                image: image,
                userImg: userImg,
                username: username,
                account: username
            }, ...prevPosts]);
        }
    };
    const handleChangePost = (newPost, oldPost) => {

    }
    const handleRemovePost = (id) => {
        setPosts(posts.filter((post) => post.id !== id));
    };

    const handleLikePost = (id) => {
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        updatedPosts[index].liked = !updatedPosts[index].liked;
        setPosts(updatedPosts);
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

    const handleEditPost = (id, newText, newImage) => {
        const updatedPosts = [...posts];
        const index = updatedPosts.findIndex((post) => post.id === id);
        updatedPosts[index].image = newImage;
        updatedPosts[index].text = newText;
        setPosts(updatedPosts);
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

    return (
        <>
            <div>
                <div className={"uploadPost post-container"} onClick={handleShow}>
                    <img src={userImg} className={"Logo"} />
                    <span>{"What's on your mind " + username + "?"}</span>
                </div>
                <>
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
                            text={post.text}
                            liked={post.liked}
                            likes={post.likes}
                            _comments={post.comments}
                            image={post.image}
                            time={post.time}
                            onLike={() => handleLikePost(post.id)}
                            onRemove={() => handleRemovePost(post.id)}
                            username={post.username}
                            userImage={post.userImg}
                            account={username}
                            onAddComment={(comment) => handleAddComment(post.id, comment)}
                            onDeleteComment={(comment, comments) => handleDeleteComment(post.id,comment, comments)}
                            onEdit={(newText, newImg) => handleEditPost(post.id, newText, newImg)}
                            mode={mode}
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
        </>
    );
}

export default PostList;
