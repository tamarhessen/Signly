import {BackToMenu} from "./Navigation"
import {useNavigate} from "react-router-dom";


function LeftSide({setLoggedIn}) {
    const navigate = useNavigate();
    return (
        <>
            <div className="column LeftAlign TopBar">
                <img src="https://live.staticflickr.com/65535/53506197898_55318ce5f5_t.jpg" id="Logo" onClick={() => BackToMenu({navigate, setLoggedIn})}/>
                <input className={"search"} placeholder="Search App"></input>
            </div>
        </>
    )
}

function Center() {
    return (
        <>
            <div className="column CenterAlign TopBar">
                <span className={"btn"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-house-fill" viewBox="0 0 16 16">
                        <path
                            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                        <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                    </svg></span>
                <span className={"btn"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-people-fill" viewBox="0 0 16 16">
                        <path
                            d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                    </svg>
                </span>
                <span className={"btn"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-activity" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/>
                    </svg>
                </span>
            </div>
        </>
    )
}

function RightSide({userImg}) {
    return (
        <>
            <div className="column RightAlign TopBar">
                <span className={"btn"}>Find friends</span>
                <span className={"btn"}>Menu</span>
                <span className={"btn"}>Message</span>
                <span className={"btn"}>Notifications</span>
                <img src={userImg} className={"Logo"}></img>
            </div>
        </>
    )
}
function InfoBar({userImg,setLoggedIn}) {
    return (
        <>
            <div className="TopBarContainer">
                <LeftSide setLoggedIn={setLoggedIn}></LeftSide>
                <Center></Center>
                <RightSide userImg={userImg}></RightSide>
            </div>
        </>
    )
}

export default InfoBar