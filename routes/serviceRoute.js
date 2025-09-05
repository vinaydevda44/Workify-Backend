const express= require('express');
const router=express.Router();

const {createService,getAllServices,getServiceById}=require('../controllers/serviceController');
const {auth,isProvider,}=require("../middleware/authMiddleware");


router.post('/create-service',auth,isProvider,createService);
router.get('/getAllServices',getAllServices);
router.get('/getServiceById/:id',auth,getServiceById);

module.exports=router;