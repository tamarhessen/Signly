import {useState} from "react";

function LoggedIn() {
    const [loggedIn, setLoggedIn] = useState(false);
    return ({loggedIn, setLoggedIn});
}

export {LoggedIn}