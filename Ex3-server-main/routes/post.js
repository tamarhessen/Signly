const postController = require('../controllers/post');

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// // Posts





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

