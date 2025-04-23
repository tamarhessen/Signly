const userController = require('../controllers/user');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { User } = require('../models/user');  // Adjust the path to your User model as needed


router.put('/update-points', async (req, res) => {
    const { username, points } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.points = points;
        await user.save();

        res.status(200).json({
            message: 'Points updated successfully',
            points: user.points
        });
    } catch (error) {
        console.error('Error updating points:', error);
        res.status(500).json({ message: 'Error updating points' });
    }
});




// Tokens
router.post('/api/tokens', userController.generateToken);

// Users
router.get('/api/users/:username', authenticateToken, userController.getUserByUsername);
router.post('/api/users', userController.registerUser);

// // Other routes

router.put('/api/users/:id', authenticateToken, userController.updateUserById);
router.patch('/api/users/:id', authenticateToken, userController.updateUserById);
router.delete('/api/users/:id', authenticateToken, userController.deleteUserById);

router.get('/api/users/:id/friends', authenticateToken, userController.getFriendsListByUserId);
router.post('/api/users/:id/friends', authenticateToken, userController.askToBeFriendOfUser);
router.patch('/api/users/:id/friends/:fid', authenticateToken, userController.acceptFriendRequest);
router.delete('/api/users/:id/friends/:fid', authenticateToken, userController.deleteFriend);

router.get('/api/users/:id/points', authenticateToken, userController.getPoints);
router.get('/leaderboard/:id', userController.getLeaderboard);
  
router.post('/lose-life/:userId', userController.handleLoseLife);
router.get('/lives/:userId', userController.handleGetLives); // Remove /api/users prefix
router.get('/time-until-life/:userId', userController.handleGetTimeUntilNextLife); // Remove /api/users prefix
module.exports = router;