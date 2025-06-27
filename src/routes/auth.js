const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for user signup
router.post('/signup', authController.signup);

// Route for user login
router.post('/login', authController.login);

// Route for getting user profile (protected)
router.get('/profile', authMiddleware.authenticate, authController.getProfile);

module.exports = router;