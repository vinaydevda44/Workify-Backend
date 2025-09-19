const User = require("../models/User");
const Profile= require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const otpGenerator= require("otp-generator");
const OTP=require("../models/OTP");
const mailSender=require("../utils/mailSender");

require('dotenv').config();

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, phone, role, otp } = req.body;

    // validation
    if (!name || !email || !password || !phone || !role || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login",
      });
    }

    // verify otp
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });


    const profileDetails = await Profile.create({
      user: newUser._id,
      location: null,
      gender: null,
      profilePicture: null,
      dateOfBirth: null,
    });

   
    newUser.additionalInfo = profileDetails._id;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Something went wrong at signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, please signup",
      });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials, please try again",
      });
    }
    user.password = undefined;
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      rating: user.rating,
      isVerified: user.isVerified,
    };

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Logged in Successfully",
      token,
      user: userResponse,
    });

  } catch (error) {
    console.log("Something went wrong at login", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.logout = async(req,res)=>{
  try{
    res.cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true,
    })

    return res.status(200).json({
      success:true,
      message:"Logged out successfully",
    })
  }
  catch(error){
    console.error("Error during Logout",error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    })
  }
}

exports.sendOTP=async(req,res)=>{
  try{
    const {email}=req.body;
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required",
      })
    }

    const existingUser= await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User already exists,please Login",
      })
    }

    const otp= otpGenerator.generate(6,
      {upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,}
    );

    // save otp to db
    const otpPayload={email,otp};
    await OTP.create(otpPayload);

    return res.status(200).json({
      success:true,
      message:"OTP sent to your email",
      otp,
    })


  }
  
  catch(error){
    console.error("Error in sending OTP",error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    })
  }
}

exports.forgotPassword= async(req,res)=>{
  try{
    const{email}=req.body;
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required",
      })
    }
    const user= await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found,please signup",
      })
    }


    const resetToken= jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"15m"}
    );
    await User.findOneAndUpdate({email},
      {token:resetToken,
      resetPasswordExpires:Date.now()+3600000
    },
      {new:true}
    );
    const resetLink=`http://localhost:4000/reset-password?token=${resetToken}`;

    // send link to email
      try{
        const mailResponse= await mailSender(
          email,
          "Password Reset Link from Workify",
          `<p>Click on the link below for reset Password.link <a href='${resetLink}'>${resetLink}</a>.This Link is expired in 15 min.</p>`
        )
        return res.status(200).json({
          success:true,
          message:"Password reset Link sent tot your email",
          mailResponse,
        })      }
      catch(error){
        console.log("Error in sending reset email",error);
      }
    }
   
  catch(error){
    console.error("Error in forgot password",error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    })
  }
}

exports.resetPassword= async(req,res)=>{
  try{
    const {token,password ,confirmPassword}=req.body;
    
    if(password !== confirmPassword){
      return res.status(400).json({
        success:false,
        message:"Password and Confirm Password do not match",
      })
    }

    const user= await User.findOne({token});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"Token is invalid",
      })
    }

    if(user.resetPasswordExpires < Date.now()){
      return res.status(400).json({
        success:false,
        message:"Token has expired,please regenerate your token",
      })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate({token},
      {password:hashedPassword,
        token:undefined,
        resetPasswordExpires:undefined,
      }
    )

    await mailSender(
      user.email,
      "Password Updated Successfully",
        `<p> password update successfully for ${user.name}</p>`
    )

    return res.status(200).json({
      success:true,
      message:"Password reset Successfully",
    })

  }
  catch(error){
    console.error("Error in reset Password",error);
    return res.status(500).json({
      success:false,
      message:"Interval server error",
    })
  }
}