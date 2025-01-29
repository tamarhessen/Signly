import React, {useState} from "react";

function AddComment({username, onAddComment}) {
    const [commentInput, setCommentInput] = useState('');

    const handleCommentInputChange = (e) => {
        console.log("gdsfdf")
        setCommentInput(e.target.value);
    };

    const handleAddComment = () => {
        console.log("asdadasd", commentInput)
        if (commentInput.trim() !== '') {
            onAddComment(commentInput);
            setCommentInput('');
        }
    };
    return (<>
        <textarea
            className={"input"}
            value={commentInput}
            onChange={handleCommentInputChange}
            placeholder={"what do you think " + username + "?"}
        />
        {/* Button to add a comment */}
        <button className={"btn btn-primary"} onClick={handleAddComment}>Add Comment</button>
    </>);
}

export default AddComment;