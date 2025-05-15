import InfoBar from "./InfoBar";
import MainScreen from "./MainScreen";
import { useState } from "react";
import './LightModeFeed.css';
import './NightModeFeed.css';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import RightPanel from './RightPanel';
import TopPanel from './TopPanel';

import Navigation from './Navigation';

function HomeScreen({setLoggedIn}) {
    const [mode, setMode] = useState(true);
    const location = useLocation();
    const { state } = location;
    const { username,displayName, profilePictureURL,token } = state;
    console.log(token);
    console.log(username+"r");
    
      const [points, setPoints] = useState(0);
      const [level, setLevel] = useState(1);
      const [nextLevelPoints, setNextLevelPoints] = useState(1000);
      const [error, setError] = useState(null);
   
    return (
        <>
            <title>Home</title>
            <div className={mode ? "light-mode" : "night-mode"}>
                {/* Assuming profilePicture is a file object */}
               
              
                <MainScreen setLoggedIn={setLoggedIn} username={username} displayName={displayName} userImg={profilePictureURL} mode={mode} setMode={setMode} token={token} ></MainScreen>

            </div>
        </>


    );
}

export default HomeScreen;