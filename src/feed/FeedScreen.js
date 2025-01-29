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
    
    const { displayName, profilePicture} = location.state;
    // Convert file object to URL
    const profilePictureURL = profilePicture ? URL.createObjectURL(profilePicture) : null;

    return (
        <>
            <title>Feed</title>
            <div className={mode ? "light-mode" : "night-mode"}>
                {/* Assuming profilePicture is a file object */}
                {profilePictureURL && <InfoBar setLoggedIn={setLoggedIn} userImg={profilePictureURL}></InfoBar>}
                <MainScreen setLoggedIn={setLoggedIn} username={displayName} userImg={profilePictureURL} mode={mode} setMode={setMode}></MainScreen>
            </div>
        </>
    );
}

export default FeedScreen;
