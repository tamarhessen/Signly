import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Friends({ username, token }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [FriendsList, setFriendList] = useState([]);
    const [PendingList, setPendingList] = useState([]);
    const navigate = useNavigate();

    const showFriendPage = (friendName, isFriend, profilePic) => {
        navigate("/FriendPage", { state: { username: friendName, token: token, _isFriend: isFriend, profilePic: profilePic } });
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('http://localhost:5000/api/Users/' + username, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': "bearer " + token,
                    }
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const json = await res.json();
                setUserData(json);
                const friendListWithProfilePic = await Promise.all(json.friends.FriendList.map(async (friend) => {
                    const profileRes = await fetch(`http://localhost:5000/api/Users/${friend}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': "bearer " + token,
                        }
                    });
                    const profileJson = await profileRes.json();
                    return { username: friend, profilePic: profileJson.profilePic };
                }));
                setFriendList(friendListWithProfilePic);
                setPendingList(json.friends.PendingList.map(pending => (
                    <div key={pending} style={{ display: 'flex', alignItems: 'center' }}>
                        <div onClick={() => showFriendPage(pending, false)} className={"FriendProfile"}>{pending}</div>
                        <button className={"nameBtn"} onClick={() => accept(pending)}>v</button>
                        <button className={"nameBtn"} onClick={() => decline(pending)}>x</button>
                    </div>
                )));
            } catch (error) {
                setError(error.message);
            }
        }

        fetchData();
    }, [username, token]);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('http://localhost:5000/api/Users/' + username, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': "bearer " + token,
                    }
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const json = await res.json();
                setUserData(json);

                // Fetch profile pictures for pending friends
                const pendingListWithProfilePic = await Promise.all(json.friends.PendingList.map(async (pending) => {
                    const profileRes = await fetch(`http://localhost:5000/api/Users/${pending}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': "bearer " + token,
                        }
                    });
                    const profileJson = await profileRes.json();
                    return { username: pending, profilePic: profileJson.profilePic };
                }));
                setPendingList(pendingListWithProfilePic);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchData();
    }, [username, token]);

    const accept = async (friendName, friendImg) => {
        const res = await fetch('http://localhost:5000/api/Users/' + username + "/friends/" + friendName, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "bearer " + token,
            }
        });
        const data = await res.json();
        if (data === null) {
            console.log("error");
        } else {
            // Update FriendList with the new friend including profile picture
            const updatedFriendList = [...FriendsList, { username: friendName, profilePic: friendImg }];
            setFriendList(updatedFriendList);
            setPendingList(data.PendingList);
        }
        // Logic to accept friend request
        console.log("Accepted:", friendName);
    };



    const decline = async (friendName) => {
        const res = await fetch('http://localhost:5000/api/Users/' + username + "/friends/" + friendName, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "bearer " + token,
            }
        });
        const data = await res.json();
        if (data === null) {
            console.log("error");
        } else {
            // Check if the friend is in the FriendsList, if so, remove it
            const updatedFriendsList = FriendsList.filter(friend => friend["username"] !== friendName);
            console.log(updatedFriendsList, friendName)
            setFriendList(updatedFriendsList);
            setPendingList(data.PendingList);
        }
        // Logic to decline friend request or remove a friend
        console.log("Declined:", friendName);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }
    const sendToServer = async (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            let friend = e.target.value;
            const res = await fetch('http://localhost:5000/api/Users/' + friend + "/friends", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "bearer " + token,
                }
            });
            const data = await res.json();
            if (data === null) {
                console.log("error");
            } else {
                e.target.value = ''; // Clear the input field
            }
        }
    }
    return (
        <div>
            <input className={"search"} placeholder="Find friends" onKeyPress={sendToServer}></input>
            <h3>Friends</h3>
            {FriendsList.length > 0 ? (FriendsList.map(friend => (
                <div key={friend.username} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={"FriendProfile"} onClick={() => showFriendPage(friend.username, true, friend.profilePic)}>
                    <img src={friend.profilePic} alt={`${friend.username}'s Profile`} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                    <div className={"name"}>{friend.username}</div>
                    </div>
                    <button className={"nameBtn"} onClick={() => decline(friend.username)}>x</button>
                </div>
            ))) : (<p>No friends</p>)}
            <h3>Pending</h3>
            {PendingList.length > 0 ? (PendingList.map(friend => (
                <div key={friend.username} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={"FriendProfile"} onClick={() => showFriendPage(friend.username, false, friend.profilePic)}>
                    <img src={friend.profilePic} alt={`${friend.username}'s Profile`} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                    <div className={"name"}>{friend.username}</div>
                    </div>
                    <button className={"nameBtn"} onClick={() => accept(friend.username, friend.profilePic)}>v</button>
                    <button className={"nameBtn"} onClick={() => decline(friend.username)}>x</button>
                </div>
            ))) : <p>No pending requests</p>}
        </div>
    );
}

export default Friends;
