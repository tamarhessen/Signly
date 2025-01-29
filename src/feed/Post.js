import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AddComment from "./AddComment";
import Comments from "./Comments";
import Dropdown from "react-bootstrap/Dropdown";

function Share() {
    return (
        <span >
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Share
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#">Share now (friends)</Dropdown.Item>
                <Dropdown.Item href="#">Share to feed</Dropdown.Item>
                <Dropdown.Item href="#">Copy link</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </span>
    );
}

function Post({ id, text, liked, likes, time, _comments, image, onLike, onRemove, onAddComment, onEdit, username, userImage, account, mode, onDeleteComment }) {
    let modeName = "";
    if (mode) {
        modeName = "light-mode"
    } else {
        modeName = "night-mode"
    }
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState(text);
    const [shiftDown, setShiftDown] = useState(false);
    const [editImg, setEditImg] = useState(image);
    const [show, setShow] = useState(false);
    const [comments, setComments] = useState(_comments);
    const handleClose = () => setShow(false);

    const handleShow = () => { setShow(true) };

    const handleEdit = () => { setEditMode(true); };

    const handleSaveEdit = () => {
        onEdit(editText, editImg);
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditText(text);
    };
    const handleEditComment = (comment, editedComment) => {
        let newComments = [];
        comments.forEach(_comment => {
            if (_comment.id === comment.id) {
                console.log("hi", _comment, comment, editedComment);
                editedComment.id = comment.id;
                newComments.push(editedComment); // Replace 3 with 300
            } else {
                newComments.push(_comment);
            }
        });
        setComments(newComments)
        return newComments;
    }
    return (
        <div className={"post-container"}>
            <div className={"header"}>
                <div className={"left-header"}>
                    <img src={userImage} className={"Logo"} alt="User logo" />
                    {username}
                </div>
                <div className={"right-header"}>
                    {time}
                </div>
            </div>
            <div>
                {editMode ? (
                    <>
                        <textarea
                            placeholder="What's on your mind?"
                            className={"input"}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !shiftDown) {
                                    handleSaveEdit();
                                } else if (e.key === 'Shift') {
                                    setShiftDown(true);
                                }
                            }}
                            onKeyUp={(e) => {
                                if (e.key === 'Shift') {
                                    setShiftDown(false);
                                }
                            }}
                        />
                        <input
                            id={"imageInput"}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const image = e.target.files[0];
                                setEditImg(image);
                            }}
                        />
                        {editText && <div>{editText}</div>}
                        {editImg && typeof editImg !== 'string' ? <img src={URL.createObjectURL(editImg)} alt="Preview" className={"image"} /> : null}
                    </>
                ) : (
                    <>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
                        {image && typeof image !== 'string' ? <img src={URL.createObjectURL(image)} alt="Uploaded" className={"image"} /> : null}
                        {image && typeof image === 'string' ? <img src={image} alt="Linked" className={"image"} /> : null}
                    </>
                )}
            </div>
            <div style={{display: "flex"}}>
            <span onClick={onLike} style={{ color: liked ? 'red' : 'black' ,flex: 1}} className={"btn btn-primary"}>
                {liked ? '❤️' : '🤍'} {liked ? parseInt(likes)+ 1 : likes}
            </span>
            {account === username ? (
                <>
                    {editMode ? (
                        <>
                            <button style={{flex: 1}} onClick={handleSaveEdit} className={"btn btn-primary"}>Save</button>
                            <button style={{flex: 1}} onClick={handleCancelEdit} className={"btn btn-secondary"}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button style={{flex: 1}} onClick={handleEdit} className={"btn btn-warning"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path
                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button style={{flex: 1}} onClick={onRemove} className={"btn btn-danger"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-x" viewBox="0 0 16 16">
                                    <path
                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708zM7.293 8l2.647-2.646a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.647 2.647a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </button>
                        </>
                    )}
                </>
            ) : null}
            {editMode ? (null) : (
                <span style={{flex: 1}} onClick={handleShow} className={"btn btn-primary"}>Comment</span>
            )}
            <span style={{flex: 1}}>
            <Share></Share>
            </span>
            </div>
            <Modal show={show} onHide={handleClose} style={{ overflow: 'hidden'}}>
                <div className={modeName}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Comments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"modalBody"}>
                        <Comments
                            text={text}
                            image={image}
                            comments={comments}
                            setComments={setComments}
                            account={account}
                            show={show}
                            setShow={setShow}
                            handleDeleteComment={onDeleteComment}
                            handleEditComment={handleEditComment}></Comments>
                    </Modal.Body>
                    <Modal.Footer>
                        <AddComment
                            username={account}
                            onAddComment={onAddComment}
                        ></AddComment>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}

export default Post;
