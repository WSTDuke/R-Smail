// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Private routes
router.get('/me', protect, AuthController.getCurrentUser);
router.get('/users', protect, AuthController.getAllUsers);

module.exports = router;
