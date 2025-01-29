const postService = require('../services/post');
const {join} = require("path");

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



async function deleteUserById(req, res) {
    let userId = req.user.username;
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
    if (!result) {
        return res.status(404).json({ error: 'Couldn\'t update' });
    }
    res.json(result)
}



async function redirectHome(req, res) {
    res.sendFile(join(__dirname,'..', 'public', 'index.html'));
}


module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,

    deleteUserById,
    updateUserById,
  
    redirectHome
};