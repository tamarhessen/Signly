import FeedScreen from "./FeedScreen";
import {BrowserRouter, Route, Routes, Navigate, useNavigate} from
        "react-router-dom";
import React, {useState} from "react";
// import {LoggedIn} from "../loggedIn";


function BackToMenu({navigate, setLoggedIn}) {
    // let {loggedIn, setLoggedIn} = LoggedIn();
    // setLoggedIn(false)

    navigate("/");
}

function SendToUserPage() {
    return (
        <></> // should change the path to user page.

    );
}

export {BackToMenu, SendToUserPage};