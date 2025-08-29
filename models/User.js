const mongoose = require('mongoose');
const { resetPassword } = require('../controllers/auth');

const userSchema = new mongoose.Schema({
    name:{type:String,
         required:true
        },
    email:{type:String,
        required:true,
        unique:true
    },
    password:{type:String,
        required:true
    },
    role:{type:String,
        enum:["Customer","Provider","Admin"],
        default:"Customer"
    },
    phone:{type:String,
        required:true
    },
    services:[{type:mongoose.Schema.Types.ObjectId, 
        ref:"Service",
    }],
    additionalInfo:{type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    token:{type:String,
        default:"",
    },
    resetPasswordExpires:{
        type:Date,
    },
    createdAt:{type:Date,
        default:Date.now
    },
})
module.exports = mongoose.model("User", userSchema);
