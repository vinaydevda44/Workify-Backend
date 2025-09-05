const Review =require('../models/Review');
const Service= require('../models/Service');
const User= require('../models/User');

// Add a review for a service

exports.createReview= async(req,res)=>{
    try{
        const {serviceId,rating,comment}=req.body;
        const userId=req.user.id;
        if(!serviceId || !rating){
            return res.status(400).json({
                success:false,
                message:"Service ID and rating are required",
            })
        }

        const service = await Service.findById(serviceId);
        if(!service){
            return res.status(400).json({
                success:false,
                message:"Service not found",
            })
        }
        const providerId= service.provider;
        const user= await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }

        const reviewPayload={userId,serviceId,providerId,rating,comment};

        const newReview = await Review.create(reviewPayload);

        return res.status(200).json({
            success:true,
            message:"Review added successfully",
            newReview, 
        })

    }
    catch(error){
        console.error("error adding review",error);
        return res.status(401).json({
            status:false,
            message:"Internal server error ",
        })
    }
}