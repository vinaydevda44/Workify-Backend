const mongoose=require("mongoose");

const profileSchema= new mongoose.Schema({
    location:{type:String,
    },
    gender:{
        type:String
    },
    profilePicture:{
        type:String
    },
    dateOfBirth:{
        type:Date
    },
});

module.exports=mongoose.model("Profile",profileSchema);