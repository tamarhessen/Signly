const { User, Friends} = require('../models/user');
const jwt = require('jsonwebtoken');

async function generateToken(user) {
    const {username, password} = user
    console.log(username, password);
    const existingUser = await User.findOne({username: username, password: password});
    if (!existingUser) {
        return null;
    }
    const payload = {username: username};
    const secretKey = 'your-secret-key';

    return jwt.sign(payload, secretKey);
}
async function getLeaderboard(currentUserId) {
    const users = await User.find({}, 'displayName points _id profilePic');


    return users.map(user => ({
        username: user.displayName,
        points: user.points,
        pic: user.profilePic
    }));
}


async function registerUser(userData) {
    const {username} = userData;
    const existingUser = await User.findOne({username: username});
    if (existingUser) {
        return null;
    }
    userData.friends = new Friends({
        FriendList: [],
        PendingList: []
    })
    const user = new User(userData);
    await user.save();
    return user;
}

async function getUserByUsername(username) {
    const user = await User.findOne({username: username}, 'username displayName profilePic friends');
    return user || null;
}


async function getFriendsListByUserId(userId) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('couldn\'t find user');
    }
    console.log(user.friends);
    return user.friends;
}

async function askToBeFriendOfUser(userId, username) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('couldn\'t find user');
        return null
    }
    if (user.friends.PendingList.includes(username) || user.friends.FriendList.includes(username)) {
        console.log('already asked');
        return null
    }
    console.log(user.friends.PendingList);
    user.friends.PendingList = [...user.friends.PendingList, username]
    await user.save();
    return user.friends;
}

async function acceptFriendRequest(userId, friendId) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('couldn\'t find user');
        return null
    }
    if (!user.friends.PendingList.includes(friendId)) {
        console.log('friend didn\'t ask');
        return null
    }
    user.friends.PendingList = user.friends.PendingList.filter(element => element !== friendId);
    user.friends.FriendList = [...user.friends.FriendList, friendId];
    await user.save();
    return user.friends;
}

async function deleteFriend(userId, friendId) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('couldn\'t find user');
        return null
    }
    if (!user.friends.PendingList.includes(friendId) && !user.friends.FriendList.includes(friendId)) {
        console.log('user didn\'t ask and isn\'t your friend');
        return null
    }
    user.friends.PendingList = user.friends.PendingList.filter(element => element !== friendId);
    user.friends.FriendList = user.friends.FriendList.filter(element => element !== friendId);
    await user.save();
    return user.friends;
}



async function deleteUserById(userId) {
    const user = await User.findOneAndRemove({username: userId})
    return user;
}

async function updateUserById(userId, newUsername, newImg, newDisplayName, newPassword) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('user doesn\'t exist');
        return null
    }
    if ((await User.findOne({username: newUsername}))) {
        console.log('couldn\'t change username stopping process');
        return null
    }
    if ((await User.findOne({displayName: newDisplayName}))) {
        console.log('couldn\'t change display name stopping process');
        return null
    }
    if (newUsername) {
        if (!(await User.findOne({username: newUsername}))) {
            let users = await User.find();
            await users.forEach(async (user) => {
                console.log(user);
                if (user !== userId) {
                    let newList = [];
                    user.friends.FriendList.forEach((friend) => {
                        if (friend == userId) {
                            newList.push(newUsername)
                        } else {
                            newList.push(friend)
                        }

                    })
                    user.friends.FriendList = newList;
                    console.log("after", user)
                    let newList2 = [];
                    user.friends.PendingList.forEach((friend) => {
                        if (friend == userId) {
                            newList2.push(newUsername)
                        } else {
                            newList2.push(friend)
                        }

                    })
                    user.friends.PendingList = newList2;
                    console.log(user);
                    await user.save();
                }
            })
            user.username = newUsername
        } else {
            console.log('couldn\'t change username stopping process');
            return null
        }
    }
    if (newImg) {

        user.profilePic = newImg;
    }
    if (newDisplayName) {
        if ((await User.findOne({displayName: newDisplayName}))) {
            console.log('couldn\'t change display name stopping process');
            return null
        }
        user.displayName = newDisplayName;
    }

    if (newPassword) {
        user.password = newPassword;
    }
    await user.save();
    return user;
}


async function updateUserPoints(userId, points) {
    try {
        const user = await User.findById(userId);  // Find user by ID
        if (!user) {
            throw new Error('User not found');
        }

        // Add points to the current total
        user.points += points;

        console.log('Updated points in DB:', user.points);  // Log the updated points

        // Save the updated user to the database
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating points');
    }
}
async function getUserPoints(userId) {
    const user = await User.findOne({ username: userId });
    if (!user) {
        console.log('couldn\'t find user');
        return null;
    }
    console.log("User Object:", user); // בדיקה כללית
    console.log("User Points:", user.points); // בדיקת השדה הספציפי
    return user.points;
}





module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,
    getFriendsListByUserId,
    askToBeFriendOfUser,
    acceptFriendRequest,
    deleteFriend,
    deleteUserById,
    updateUserById,
    updateUserPoints,
    getUserPoints,
    getLeaderboard
};