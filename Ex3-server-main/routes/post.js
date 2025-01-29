const postController = require('../controllers/post');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// // Posts
router.get('/api/posts', authenticateToken, postController.getPosts);
router.post('/api/users/:id/posts/:postId/Comments', authenticateToken, postController.createComment);
router.get('/api/users/:id/Posts/:postId/Comments', authenticateToken, postController.getCommentsByPostId);
router.delete('/api/users/:id/Posts/:postId/Comments/:commentId', authenticateToken, postController.deleteComment);
router.patch('/api/users/:id/Posts/:postId/Comments/:commentId', authenticateToken, postController.editComment);
router.post('/api/posts/:id', authenticateToken, postController.likePost);




// Tokens
router.post('/api/tokens', postController.generateToken);

// Users
router.get('/api/users/:username', authenticateToken, postController.getUserByUsername);
router.post('/api/users', postController.registerUser);

// // Other routes

router.put('/api/users/:id', authenticateToken, postController.updateUserById);
router.patch('/api/users/:id', authenticateToken, postController.updateUserById);
router.delete('/api/users/:id', authenticateToken, postController.deleteUserById);


router.get('/*',postController.redirectHome)





module.exports = router;

