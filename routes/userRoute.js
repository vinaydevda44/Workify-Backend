const express = require('express');
const router = express.Router();

const {signUp,login,sendOTP,logout,forgotPassword,resetPassword} = require('../controllers/auth');

router.post('/signup',signUp,);
router.post('/login',login);
router.post('/logout',logout);
router.post('/send-otp',sendOTP);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);


module.exports = router;