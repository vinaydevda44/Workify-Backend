const mongoose=require("mongoose");
const nodemailer=require("nodemailer");
const mailSender=require("../utils/mailSender");
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:300, 
    },
});

async function sendVerificationEmail(email,otp){
    try{
       const mailResponse=await mailSender(
        email,
        "Verification Email from Workify",
        `<p>your verification otp is ${otp}.this is expire in 5 min</p>`
       )
       console.log("Email sent successfully",mailResponse);
     }
    catch(error){
        console.log("Error in sending verification email",error);

    }
}

OTPSchema.pre("save",async function(next){
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
});
 


module.exports=mongoose.model("OTP",OTPSchema);