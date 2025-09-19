const mongoose=require("mongoose");

const profileSchema= new mongoose.Schema({
      user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,   
  },
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