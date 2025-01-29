import Comment from "./Comment";
import React, { useEffect, useState } from "react";

function Comments({ text, image, show, setShow, comments, setComments, account, handleDeleteComment, handleEditComment }) {
  const onDelete = (comment, comments) => {
    let newComments = handleDeleteComment(comment, comments);
    console.log("hi");
    setComments(newComments);
    setShow(false)
    if (comments !== undefined) {
      setShow(true)
    }
  };
    console.log("comments", comments);
  return (
    <>
      <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
      {image && typeof image !== 'string' ? <img src={URL.createObjectURL(image)} alt="Uploaded" className={"image"} /> : null}
      {image && typeof image === 'string' ? <img src={image} alt="Linked" className={"image"} /> : null}

      <ul>
        {comments && comments.map((comment, index) => (
          <Comment
            key={index}
            id={index}
            commentId={comment.id}
            username={comment["username"]}
            userImg={comment["userImg"]}
            comment={comment["comment"]}
            account={account}
            onDelete={onDelete}
            _handleEditComment={handleEditComment}
            setComments={setComments}
          />
        ))}
      </ul>
    </>
  )
}

export default Comments;
