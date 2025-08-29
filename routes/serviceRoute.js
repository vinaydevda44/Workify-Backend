const express= require('express');
const router=express.Router();

const {createService}=require('../controllers/serviceController');
const {auth}=require("../middleware/authMiddleware");


router.post('/create-service',auth,createService);

module.exports=router;