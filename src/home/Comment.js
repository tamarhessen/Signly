import React, { useState } from "react";

function Comment({ id, commentId, username, userImg, comment, account, onDelete, _handleEditComment, setComments }) {
    const [editMode, setEditMode] = useState(false);
    const [editedComment, setEditedComment] = useState(comment);
    const [unEditedComment, setUnEditedComment] = useState(comment);

    const handleEditComment = () => {
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        // Save the edited comment
        let commentData = {
            comment: comment,
            username: username,
            userImg: userImg,
            id: commentId
        }
        let editedCommentData = {
            comment: editedComment,
            username: username,
            userImg: userImg,
            id: commentId
        }
        let newComments = _handleEditComment(commentData, editedCommentData)
        setComments(newComments);
        setUnEditedComment(editedComment);
        setEditMode(false);

        onDelete({comment: null, username: null, userImg: null, id: -1}, newComments);
        // Call an edit function passing the edited comment
    };
    const handleCancelEdit = () => {
        setEditedComment(unEditedComment);
        setEditMode(false);
    }

    const handleDeleteComment = () => {
        // Call the onDelete function passing the comment id
        console.log("id",commentId);
        let commentData = {
            comment: comment,
            username: username,
            userImg: userImg,
            id: commentId
        }
        console.log(commentData)
        onDelete(commentData);
    };

    return (
        <div className={"comment"}>
            <img src={userImg} className="Logo" alt="User" />
            <div className="message-box">
                <div className="comment-header">
                    <span className="username">{username}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }} className="comment-body">
                    {editMode ? (
                        <textarea
                            className={"input"}
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        />
                    ) : (
                        <span>{editedComment}</span>
                    )}
                </div>
                {account === username && (
                    <div className="comment-actions">
                        {editMode ? (
                            <>
                            <button onClick={handleSaveEdit} className={"btn btn-primary"}>
                                Save
                            </button>
                            <button onClick={handleCancelEdit} className={"btn btn-secondary"}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleEditComment} className={"btn btn-warning"}>
                                    Edit
                                </button>
                                <button onClick={handleDeleteComment} className={"btn btn-danger"}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
