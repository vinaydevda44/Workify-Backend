const express = require('express');
const router = express.Router();

const {signUp,login,sendOTP,logout,forgotPassword,} = require('../controllers/auth');
const {getUserDetails,updateUserDetails,} = require('../controllers/userController');

// Auth routes

router.post('/signup',signUp,);
router.post('/login',login);
router.post('/logout',logout);
router.post('/send-otp',sendOTP);
router.post('/forgot-password',forgotPassword);

// User routes
router.get('/getUser/:id',getUserDetails);
router.put('/updateUser/:id',updateUserDetails);

module.exports = router;