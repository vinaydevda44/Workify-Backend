const express = require('express');

const router = express.Router();

const {createReview,getReviewsByServiceId}=require('../controllers/reviewController');

const {auth}=require("../middleware/authMiddleware");


router.post('/create-review',auth,createReview);
router.get('/getReviewsByServiceId/:serviceId',auth,getReviewsByServiceId);

module.exports = router;

