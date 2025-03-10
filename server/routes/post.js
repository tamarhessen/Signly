const postController = require('../controllers/post');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { User } = require('../models/post');  // Adjust the path to your User model as needed

// // Posts
router.get('/api/posts', authenticateToken, postController.getPosts);
router.post('/api/users/:id/posts/:postId/Comments', authenticateToken, postController.createComment);
router.get('/api/users/:id/Posts/:postId/Comments', authenticateToken, postController.getCommentsByPostId);
router.delete('/api/users/:id/Posts/:postId/Comments/:commentId', authenticateToken, postController.deleteComment);
router.patch('/api/users/:id/Posts/:postId/Comments/:commentId', authenticateToken, postController.editComment);
router.post('/api/posts/:id', authenticateToken, postController.likePost);
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
router.post('/api/tokens', postController.generateToken);

// Users
router.get('/api/users/:username', authenticateToken, postController.getUserByUsername);
router.post('/api/users', postController.registerUser);

// // Other routes
// router.get('/*',postController.redirectHome)
//
router.put('/api/users/:id', authenticateToken, postController.updateUserById);
router.patch('/api/users/:id', authenticateToken, postController.updateUserById);
router.delete('/api/users/:id', authenticateToken, postController.deleteUserById);
router.get('/api/users/:id/posts', authenticateToken, postController.getPostsByUserId);
router.post('/api/users/:id/posts', authenticateToken, postController.createPost);
router.put('/api/users/:id/posts/:pid', authenticateToken, postController.editPost);
router.patch('/api/users/:id/posts/:pid', authenticateToken, postController.editPost);
router.delete('/api/users/:id/posts/:pid', authenticateToken, postController.deletePost);
router.get('/api/users/:id/friends', authenticateToken, postController.getFriendsListByUserId);
router.post('/api/users/:id/friends', authenticateToken, postController.askToBeFriendOfUser);
router.patch('/api/users/:id/friends/:fid', authenticateToken, postController.acceptFriendRequest);
router.delete('/api/users/:id/friends/:fid', authenticateToken, postController.deleteFriend);

router.get('/api/users/:id/points', authenticateToken, postController.getPoints);
  



module.exports = router;