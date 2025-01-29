import InfoBar from "./InfoBar";
import MainScreen from "./MainScreen";
import { useState } from "react";
import './LightModeFeed.css';
import './NightModeFeed.css';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

function FeedScreen({setLoggedIn}) {
    const [mode, setMode] = useState(true);
    const location = useLocation();
    const { state } = location;
    const { username,displayName, profilePictureURL,token } = state;
    console.log(token);
    console.log(username+"r");

    return (
        <>
            <title>Feed</title>
            <div className={mode ? "light-mode" : "night-mode"}>
                {/* Assuming profilePicture is a file object */}
                {profilePictureURL && <InfoBar username={username} userImg={profilePictureURL} mode={mode} token={token}></InfoBar>}
                <MainScreen setLoggedIn={setLoggedIn} username={username} displayName={displayName} userImg={profilePictureURL} mode={mode} setMode={setMode} token={token}></MainScreen>
            </div>
        </>
    );
}

export default FeedScreen;