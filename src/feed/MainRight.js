import {useNavigate} from "react-router-dom";
import {BackToMenu} from "./Navigation";
import Friends from "./Friends";

function RightSide({mode, setMode, username, token, setLoggedIn}) {

    function changeMode() {
        setMode(!mode);
    }
    const navigate = useNavigate();
    return (

        <div className={"column"}>
            {mode ?
                <div className={"HiddenButton"} onClick={changeMode}>Light mode</div> : <div className={"HiddenButton"} onClick={changeMode}>Night mode</div>}
            <div className={"HiddenButton"} onClick={() => BackToMenu({navigate, setLoggedIn})}>Log out</div>
            <Friends username={username} token={token}></Friends>
        </div>)
}

export default RightSide;