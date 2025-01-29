import {SendToUserPage} from "./Navigation"
import {useState} from "react";
import LeftSide from "./MainLeft"
import MainFeedCenter from "./MainFeedCenter";
import RightSide from "./MainRight";
function MainScreen({ setLoggedIn,username, displayName,userImg, mode, setMode,token}) {
    console.log(username+"rrr");
    return (
        <>
            <div className="MainScreen">
                <LeftSide displayName={displayName}></LeftSide>
                <MainFeedCenter username={username}displayName={displayName} userImg={userImg} mode={mode} token={token}></MainFeedCenter>
                <RightSide username={username} userImg={userImg} setMode={setMode} mode={mode} token={token}></RightSide>
            </div>
        </>
    )
}

export default MainScreen;