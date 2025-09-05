const User= require('../models/User');
const Profile= require('../models/Profile');

// Get user details
exports.getUserDetails= async(req,res)=>{
    try{
        const userId= req.params.id;    
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required",
            })
        }
        const user= await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        const profile= await Profile.findOne({user:userId});
        return res.status(200).json({
            success:true,
            user,
            profile,
        })
    }
    catch(error){
        console.error("Error fetching user details",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }   
}

// Update  user details
exports.updateUserDetails= async(req,res)=>{
    try{
       
        const {name,email,phone}=req.body;
        const userId=req.params.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required",
            })
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not Found"
            })
        }

        if(name) user.name=name;
        if(email) user.email=email;
        if(phone) user.phone=phone;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"User details updated successfully",
            user,
        })    
    }
    catch(error){
        console.error("Error updating user details",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

