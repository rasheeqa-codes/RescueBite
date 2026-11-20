const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Registration API
router.post('/register', registerUser);

// Login API
router.post('/login', loginUser);
// Get Logged-in User Profile
router.get('/me', protect, getMe);
// Update Logged-in User Profile
router.put('/profile', protect, updateProfile);

module.exports = router;