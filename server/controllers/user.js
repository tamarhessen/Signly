const userService = require('../services/user');

// Token Controller
async function generateToken(req, res) {
    const token = await userService.generateToken(req.body);
    if (!token) {
        return res.status(404).json({ error: 'invalid username and or password' });
    }
    // res.json({ token });
    res.send(token);
}

async function registerUser(req, res) {
    const user = await userService.registerUser(req.body);
   
    if (!user) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    console.log("saved user:", user);

    res.json(user);
}

async function getUserByUsername(req, res) {
    const user = await userService.getUserByUsername(req.params.username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
}







async function deleteUserById(req, res) {
    let userId = req.params.id;
    const result = await userService.deleteUserById(userId);
    res.json(result)
}

async function updateUserById(req, res) {
    let userId = req.params.id
    let newImg = req.body.profilePic;
    let newUsername = req.body.username;
    let newDisplayName = req.body.displayName;
    let newPassword = req.body.password;
    const result = await userService.updateUserById(userId, newUsername, newImg, newDisplayName, newPassword);
    res.json(result)
}


async function updateUserPoints(userId, points) {
    try {
        const user = await User.findById(userId);  // Replace with your DB model
        if (!user) {
            throw new Error('User not found');
        }

        // Add points to the current total
        user.points += points;

        console.log('Updated points in DB:', user.points);  // Log the points after update

        // Save the updated user
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating points');
    }
}

async function updatePoints(req, res) {
    const userId = req.params.id;
    const { points } = req.body;  // Get points from request body

    try {
        const updatedUser = await userService.updateUserPoints(userId, points);
        res.json(updatedUser);  // Return updated user object with points
    } catch (error) {
        console.error('Error updating points:', error);
        res.status(500).json({ error: 'Error updating points' });
    }
}
async function getPoints(req, res) {
    let userId = req.params.id;
    const points = await userService.getUserPoints(userId);
    res.json(points)
}
// ב-controller
async function getLeaderboard(req, res) {
    try {
        const userId = req.params.id;
        const leaderboard = await userService.getLeaderboard(userId);
        res.json(leaderboard); // 💥 זה חייב להיות מערך
    } catch (error) {
        console.error("Error in getLeaderboard:", error);
        res.status(500).json({ error: "Server error" });
    }
}
async function handleLoseLife(req, res) {
    try {
      const userId = req.params.userId;
      const result = await userService.loseLife(userId);
      res.json(result);
    } catch (error) {
      res.status(403).json(error);
    }
  }
  async function handleGetLives(req, res) {
    try {
      const userId = req.params.userId;
      const result = await userService.getLives(userId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
  
  async function handleGetTimeUntilNextLife(req, res) {
    try {
      const userId = req.params.userId;
      const result = await userService.getTimeUntilNextLife(userId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }






module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,
    
    deleteUserById,
    updateUserById,
    updatePoints,
    updateUserPoints,
    getPoints,
    getLeaderboard,
    handleLoseLife,
    handleGetLives,
    handleGetTimeUntilNextLife
};