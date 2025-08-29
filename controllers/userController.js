const User= require('../models/User');
const Profile= require('../models/Profile');


// Get user profile

exports.userProfile= async(req,res)=>{
    try{
       

    }
    catch(error){
        console.error("Error in userProfile",error);
        return res.status(400).json({
            success:false,
            message:"Internal server error "
        })
    }
}
