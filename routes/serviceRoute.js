const express= require('express');
const router=express.Router();

const {createService,getAllServices,getServiceById,updateServiceById,deleteServiceById}=require('../controllers/serviceController');
const {auth,isProvider,}=require("../middleware/authMiddleware");


router.post('/create-service',auth,isProvider,createService);
router.get('/getAllServices',getAllServices);
router.get('/getServiceById/:id',auth,getServiceById);
router.put('/updateServiceById/:id',auth,isProvider,updateServiceById);
router.delete('/deleteServiceById/:id',auth,isProvider,deleteServiceById);

module.exports=router;