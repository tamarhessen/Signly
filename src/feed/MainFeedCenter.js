// import UploadPost from "./UploadPost";
// import {Posts} from "./Posts.js";
import PostList from "./Posts";
import {useState} from "react";
function MainFeedCenter({username, displayName,userImg, mode,token}) {
    console.log(token);
    const [postElements, setPostElements] = useState([]);
    console.log(username)
    return (<>
        <div className="column MainColumn">
        {/*<UploadPost username={username}></UploadPost>*/}
        <br/>
            {/*<Posts username={username}></Posts>*/}
            <PostList username={username} displayName={displayName}userImg={userImg} mode={mode} token={token}></PostList>
        </div>
    </>);
}

export default MainFeedCenter