import {useState} from "react";
function LeftSide({username}) {

    let SmallOptionBar = [[username, actionPlaceHolder],
        ["Find Friends", actionPlaceHolder],
        ["Groups", actionPlaceHolder],
        ["Feeds", actionPlaceHolder],
        ["Marketplace", actionPlaceHolder],
        ["Video", actionPlaceHolder],
        ["Memories", actionPlaceHolder],
        ["Saved", actionPlaceHolder],
        ["Pages", actionPlaceHolder],
        ["See More", SeeMore]];
    let LargeOptionBar = [[username, actionPlaceHolder],
        ["Find Friends", actionPlaceHolder],
        ["Groups", actionPlaceHolder],
        ["Feeds", actionPlaceHolder],
        ["Marketplace", actionPlaceHolder],
        ["Video", actionPlaceHolder],
        ["Memories", actionPlaceHolder],
        ["Saved", actionPlaceHolder],
        ["Pages", actionPlaceHolder],
        ["Ads manager",actionPlaceHolder],
        ["Climate science center", actionPlaceHolder],
        ["Events", actionPlaceHolder],
        ["Fundraisers", actionPlaceHolder],
        ["Gaming video", actionPlaceHolder],
        ["Messenger", actionPlaceHolder],
        ["Meta Quest", actionPlaceHolder],
        ["Orders and payments", actionPlaceHolder],
        ["Play games", actionPlaceHolder],
        ["Recent ads activity", actionPlaceHolder],
        ["See Less", SeeLess]];
    const [options,setOptions] = useState(SmallOptionBar.map((opt,key ) =>{
        return <div className="HiddenButton" onClick={opt[1]}>{opt[0]}</div>;
    }));
    function actionPlaceHolder() {
        console.log("hi");
    }
    function SeeMore() {
        setOptions(LargeOptionBar.map((opt,key ) =>{
            return <div className="HiddenButton" onClick={opt[1]}>{opt[0]}</div>;
        }));
    }
    function SeeLess() {
        setOptions(SmallOptionBar.map((opt,key ) =>{
            return <div className="HiddenButton" onClick={opt[1]}>{opt[0]}</div>;
        }));
    }


    return <div className="column">
        {options}
    </div>;
}

export default LeftSide;