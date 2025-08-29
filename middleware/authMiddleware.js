const jwt= require('jsonwebtoken');
require('dotenv').config();

const User =require("../models/User");

exports.auth = async(req,res,next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }

        try{
             const decode = jwt.verify(token,process.env.JWT_SECRET);

        req.user=decode;
        
        next();
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
        }
       

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

exports.isProvider= async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id)

        if(user.role !== "Provider"){
            return res.status(403).json({
                success:false,
                message:"This is a protected route for service providers only",
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

exports.isCustomer= async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id)

        if(user.role !== "Customer"){
            return res.status(403).json({
                success:false,
                message:"This is a protected route for customer only",
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

exports.isAdmin= async(req,res,next)=>{
    try{
        const user = await User.findById(req.user.id)

        if(user.role !== "Admin"){
            return res.status(403).json({
                success:false,
                message:"This is a protected route for admin only",
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}