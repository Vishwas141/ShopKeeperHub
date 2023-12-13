// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Register user
router.route('/signup').post(authController.registerUser);

// Login user
router.route('/login').post(authController.loginUser);

module.exports = router;
