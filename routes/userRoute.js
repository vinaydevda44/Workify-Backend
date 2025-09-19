const express = require('express');
const router = express.Router();

const {signUp,login,sendOTP,logout,forgotPassword,} = require('../controllers/auth');
const {getUserDetails,updateUserDetails,deleteUser,updateDisplayPicture} = require('../controllers/userController');

const{auth}=require("../middleware/authMiddleware");
// Auth routes

router.post('/signup',signUp,);
router.post('/login',login);
router.post('/logout',logout);
router.post('/send-otp',sendOTP);
router.post('/forgot-password',forgotPassword);

// User routes
router.get('/getUser/:id',getUserDetails);
router.put('/updateUser',auth,updateUserDetails);
router.delete('/deleteUser',auth,deleteUser);
router.put('/updateDisplayPicture',auth,updateDisplayPicture);


module.exports = router;