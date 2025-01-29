const postService = require('../services/post');

// Token Controller
async function generateToken(req, res) {
    const token = await postService.generateToken(req.body);
    if (!token) {
        return res.status(404).json({ error: 'invalid username and or password' });
    }
    // res.json({ token });
    res.send(token);
}

async function registerUser(req, res) {
    const user = await postService.registerUser(req.body);
    if (!user) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    res.json(user);
}

async function getUserByUsername(req, res) {
    const user = await postService.getUserByUsername(req.params.username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
}

async function getPosts(req, res) {
    const posts = await postService.getPosts(req.user.username);
    console.log("abc", posts)
    if (!posts) {
        return res.status(404).json({ error: 'Posts not found' });
    }
    res.json(posts)
}

async function createPost(req, res) {
    let user = await postService.getUserByUsername(req.user.username);
    let username = user.displayName;
    let userImg = user.profilePic;
    console.log(userImg)
    const post = await postService.createPost(username, userImg, req.body.postText, req.body.postImg);
    if (!post) {
        return res.status(404).json({ error: 'Couldn\'t create a post'})
    }
    res.json(post)
}

async function editPost(req, res) {
    let postId = req.params.pid;
    console.log(req.params.pid);
    const post = await postService.getPostById(postId);
    if (!post) {
        return res.status(404).json({ error: 'Couldn\'t find post'})
    }
    const newPost = await postService.editPost(post, req.body.postText, req.body.postImg);
    res.json(newPost)
}

async function deletePost(req, res) {
    console.log("hola2", req.params);
    let postId = req.params.pid;
    let post = await postService.deletePost(postId);
    res.json(post);
}

async function getFriendsListByUserId(req, res) {
    let userId = req.params.id;
    const friendsList = await postService.getFriendsListByUserId(userId);
    console.log("2", friendsList);
    res.json(friendsList)
}

async function askToBeFriendOfUser(req, res) {
    let userId = req.params.id;
    console.log("hola")
    const result = await postService.askToBeFriendOfUser(userId, req.user.username);
    res.json(result);
}

async function acceptFriendRequest(req, res) {
    let userId = req.params.id;
    let friendId = req.params.fid;
    const result = await postService.acceptFriendRequest(userId, friendId);
    res.json(result);
}

async function deleteFriend(req, res) {
    let userId = req.params.id;
    let friendId = req.params.fid;
    const result = await postService.deleteFriend(userId, friendId);
    res.json(result)
}

async function getPostsByUserId(req, res) {
    let userId = req.params.id;
    let realUser = req.user.username;
    const result = await postService.getAllPostsByUserId(userId, realUser);
    res.json(result);
}

async function deleteUserById(req, res) {
    let userId = req.params.id;
    const result = await postService.deleteUserById(userId);
    res.json(result)
}

async function updateUserById(req, res) {
    let userId = req.params.id
    let newImg = req.body.profilePic;
    let newUsername = req.body.username;
    let newDisplayName = req.body.displayName;
    let newPassword = req.body.password;
    const result = await postService.updateUserById(userId, newUsername, newImg, newDisplayName, newPassword);
    res.json(result)
}

async function likePost(req, res) {
    let postId = req.params.id;
    let username = req.user.username;
    const result = await postService.likePost(postId, username);
    res.json(result)
}

async function createComment(req, res) {
    let postId = req.params.postId;
    let user = await postService.getUserByUsername(req.user.username);
    let userImg = user.profilePic;
    let username = user.displayName;
    let commentText = req.body.text;
    const result = await postService.createComment(postId, username, userImg, commentText);
    res.json(result)
}

async function editComment(req, res) {
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let user = postService.getUserByUsername(req.user.username);
    let username = user.displayName;
    let commentText = req.body.text;
    const result = await postService.editComment(postId, username, commentText, commentId);
    res.json(result)
}

async function deleteComment(req,res) {
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let username = req.params.id;
    const result = await postService.deleteComment(postId, username, commentId);
    res.json(result)
}

async function getCommentsByPostId(req, res) {
    let postId = req.params.postId;
    const result = await postService.getCommentsByPostId(postId);
    res.json(result)
}

module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,
    getPosts,
    createPost,
    editPost,
    deletePost,
    getFriendsListByUserId,
    askToBeFriendOfUser,
    acceptFriendRequest,
    deleteFriend,
    getPostsByUserId,
    deleteUserById,
    updateUserById,
    likePost,
    createComment,
    editComment,
    deleteComment,
    getCommentsByPostId
};