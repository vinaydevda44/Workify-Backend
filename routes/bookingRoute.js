const express=require("express");

const router=express.Router();


const{createBooking,getUserBookings,getProviderBookings,updateBookingStatus,deleteBooking}=require('../controllers/bookingController');
const{auth}=require("../middleware/authMiddleware");


router.post('/create-Booking',auth,createBooking);
router.get('/getUserBookings/:id',auth,getUserBookings);
router.get('/getProviderBookings/:providerId',auth,getProviderBookings);
router.put('/updateBookingStatus/:bookingId',auth,updateBookingStatus);
router.put('/delete-Booking/:bookingId',auth,deleteBooking);



module.exports=router;