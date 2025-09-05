const express = require('express');

const router = express.Router();

const {createReview}=require('../controllers/reviewController');

const {auth}=require("../middleware/authMiddleware");


router.post('/create-review',auth,createReview);

module.exports = router;

