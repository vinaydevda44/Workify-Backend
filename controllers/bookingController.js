const Booking =require('../models/Booking');
const Service= require('../models/Service');
const User= require('../models/User');

// Create a new booking

exports.createBooking= async(req,res)=>{
    try{
        const {serviceId,bookingDate,userId,providerId}=req.body;
        if(!serviceId || !bookingDate || !userId || !providerId){
            return res.status(400).json({
                success:false,
                message:"All field are required",
            })
        }
        // Check if service exists
        const service = await Service.findById(serviceId);
        if(!service){
            return res.status(404).json({
                success:false,
                message:"Service not found",
            })
        }
        
        // Check if user exists
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        // Check if provider exists
        const provider= await User.findById(providerId);        
        if(!provider){
            return res.status(404).json({
                success:false,
                message:"Provider not found",
            })
        }

        const bookingPayload={serviceId,bookingDate,userId,providerId};

        const newBooking= await Booking.create(bookingPayload);

        return res.status(201).json({
            success:true,
            message:"Booking created successfully",
            newBooking,
        })


    }
    catch(error){
        console.error("Error in creating booking",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

// Get bookings for a user

exports.getUserBookings= async(req,res)=>{
    try{
        const{userId}=req.params;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required",
            })
        }

        const bookings= await Booking.find({userId}).populate('serviceId').populate('providerId','name email phone');

        if(!bookings || bookings.length===0){
            return res.status(200).json({
                success:true,
                bookings:[],
                message:"No bookings found for this user",
            })
        }
        return res.status(200).json({
            success:true,
            bookings,
        })


    }
    catch(error){
        console.error("Error in fetching user bookings",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

// Get bookings for a provider

exports.getProviderBookings- async(req,res)=>{
    try{
        const{providerId}=req.params;
        if(!providerId){
            return res.status(400).json({
                success:false,
                message:"Provider ID is required",
            })
        }

        const bookings= await Booking.find({providerId}).populate('serviceId').populate('userId','name email phone');

        if(!bookings || bookings.length===0){
            return res.status(200).json({
                success:true,
                bookings:[],
                message:"No bookings found for this provider",
            })
        }
        return res.status(200).json({
            success:true,
            bookings,
        })
    }
    catch(error){
        console.error("Error in fetching provider bookings",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
};

// Update booking status
exports.updateBookingStatus= async(req,res)=>{
    try{
        const {bookingId}=req.params;
        const {status}=req.body;

        if(!bookingId || !status){
            return res.status(400).json({
                success:false,
                message:"All field are required",
            })
        }
        const validStatuses=["Pending","Confirmed","Completed","Cancelled"];
        if(!validStatuses.includes(status)){
            return res.status(400).json({
                success:false,
                message:"Invalid status value",
            })
        }
        const booking= await Booking.findById(bookingId);
        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found",
            })
        }
        booking.status=status;
        await booking.save();   
        return res.status(200).json({
            success:true,
            message:"Booking status updated successfully",
            booking,
        })

    }
    catch(error){
        console.error("Error in updating booking status",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

// Cancel a booking
exports.cancelBooking= async(req,res)=>{
    try{
        const {bookingId}=req.params;
        if(!bookingId){
            return res.status(400).json({
                success:false,
                message:"Booking Id is required",
            })
        }

        const booking= await Booking.findById(bookingId);
        if(!booking){
            return res.status(400).json({
                success:false,
                message:"Booking not found",
            })
        }
        if(booking.status==="Cancelled"){
            return res.status(400).json({
                success:false,
                message:"Booking is already cancelled",
            })
        }

        booking.status="Cancelled";
        await booking.save();
        return res.status(200).json({
            success:true,
            message:"Booking cancelled successfully",
            booking,
        })
    }
    catch(error){
        console.error("Error in cancelling booking",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

// Delete a booking 

exports.deleteBooking =async(req,res)=>{
    try{
        const {bookingId}=req.params;
        if(!bookingId){
            return res.status(400).json({
                success:false,
                message:"Booking Id is required",
            })
        }
        const booking = await Booking.findById(bookingId);
        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found",
            })
        }

        await Booking.findByIdAndDelete(bookingId);

        return res.status(200).json({
            success:true,
            message:"Booking deleted Successfully",
        })
    }
    catch(error){
        console.error("Error in deleting booking",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}