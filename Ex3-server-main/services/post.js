const {Post, Comment, User, Friends} = require('../models/post.js');
const jwt = require('jsonwebtoken');

let postId = 0;
let commentId = 0;

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




async function deleteUserById(userId) {
    console.log("gsagsfsfd", userId);
    const displayName = (await User.findOne({username: userId})).displayName;
    console.log("displayName", displayName);
    const posts = await Post.deleteMany({CreatorUsername: userId});
    const all_posts = await Post.find();
    await all_posts.forEach(async (post) => {
        post.Comments = post.Comments.filter((comment) => {
            if (comment.creator != displayName) {
                return comment
            }
        })
    })
    const all_users = await User.find();
    await all_users.forEach(async (user) => {
        user.friends.FriendList = user.friends.FriendList.filter(friend => friend !== userId)
        user.friends.PendingList = user.friends.PendingList.filter(friend => friend !== userId)
        if (user.username == userId) {

        } else {
            user.save();
        }
    })
    const user = await User.findOneAndRemove({username: userId})
    return user;
}

async function updateUserById(userId, newUsername, newImg, newDisplayName, newPassword) {
    console.log("hello", userId)
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
        console.log("1")
        let posts = await Post.find();
        console.log("2", posts.length)
        await posts.forEach(async (post) => {
            console.log("2.5")
            if (post.Creator === user.displayName) {
                console.log("3")
                post.CreatorImg = newImg;

            }
            await post.Comments.forEach(async (comment) => {
                console.log("4")
                if (comment.creator === user.displayName) {
                    console.log("5")
                    comment.creatorImg = newImg;
                }
            })
            console.log("6", post)
            await post.save();
            console.log("7")
        })
        console.log("8")
        let comments = await Comment.find();
        console.log("9", comments.length)
        await comments.forEach(async (comment) => {
            console.log("10")
            if (comment.creator === user.displayName) {
                console.log("11")
                comment.creatorImg = newImg;
                await comment.save();
            }
        })
        console.log("12")
        user.profilePic = newImg;

    }
    if (newDisplayName) {
        console.log("helloo2", newDisplayName)
        if ((await User.findOne({displayName: newDisplayName}))) {
            console.log('couldn\'t change display name stopping process');
            return null
        }
        let posts = await Post.find();
        await posts.forEach(async (post) => {
            console.log("yes")
            if (post.Creator === user.displayName) {
                console.log("no?")
                post.Creator = newDisplayName;

            }
            await post.Comments.forEach(async (comment) => {
                if (comment.creator === user.displayName) {
                    comment.creator = newDisplayName;
                }
            })
            await post.save();
        })
        console.log("here")
        let comments = await Comment.find();
        console.log(comments)
        await comments.forEach(async (comment) => {
            if (comment.creator === user.displayName) {
                comment.creator = newDisplayName;
                await comment.save();
            }
        })
        console.log("hereee")
        user.displayName = newDisplayName;
    }

    if (newPassword) {
        user.password = newPassword;
    }
    console.log("lastone", user)
    await user.save();
    console.log("no way")
    return user;
}



module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,
   
    deleteUserById,
    updateUserById,
   
};

