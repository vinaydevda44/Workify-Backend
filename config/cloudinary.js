const cloudinary = require('cloudinary').v2;

exports.cloudinaryConnect=() =>{
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.CLOUD_API_KEY,
            api_secret:process.env.CLOUD_SECRET,
        })
    }
    catch(err){
        console.log("Cloudinary connection error",err);

    }
}