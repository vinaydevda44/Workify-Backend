const Review =require('../models/Review');
const Service= require('../models/Service');
const User= require('../models/User');

// Add a review for a provider

exports.createReview= async(req,res)=>{
    try{
        const {providerId,serviceId,rating,comment}=req.body;
        if(!providerId || !serviceId || !rating || !comment){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
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
        // Check if service exists
        const service= await Service.findById(serviceId);
        if(!service){
            return res.status(404).json({
                success:false,
                message:"Service not found",
            })
        }
        const userId=req.user.id; 
        const newReview= await Review.create({
            userId,
            providerId,
            serviceId,
            rating,
            comment,
        });
        return res.status(201).json({
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

// get all reviews for a service

exports.getReviewsByServiceId= async(req,res)=>{
    try{
        const {serviceId}=req.params;
        if(!serviceId){
            return res.status(400).json({
                success:false,
                message:"Service Id is required",
            })
        }
        const reviews = await Review.find({serviceId}).populate('userId','name email').sort({createdAt:-1});
        if(!reviews){
            return res.status(404).json({
                success:false,
                message:"No reviews found for this service",
            })
        }
        return res.status(200).json({
            success:true,
            reviews,
        })  
        
    }
    catch(error){
        console.error("error fetching reviews",error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}
