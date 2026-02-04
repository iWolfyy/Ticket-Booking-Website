const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


// Get all users (admin only)
router.get('/', protect, authorize('admin'), getAllUsers);

// Get user profile
router.get('/profile', protect, getUser);

// Update user profile
router.put('/profile/:id', protect, upload.single('profilepic'), updateUser);

module.exports = router;