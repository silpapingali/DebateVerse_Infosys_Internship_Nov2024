const express = require('express');
const router = express.Router();
const {signup,login,
    verifyOtp,resetPassword,forgotPassword
} = require('../controllers/authController');


// User registration (Signup)
router.post('/signup', signup);

// User login
router.post('/login', login);

// Forgot Password - OTP generation
router.post('/forgotPassword',forgotPassword);

// Verify OTP
router.post('/verifyOtp', verifyOtp);

// Reset Password
router.post('/resetPassword', resetPassword);


module.exports = router;
