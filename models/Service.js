const mongoose= require('mongoose');

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true}
        ,
    description:{
        type:String,
        required:true
    },
    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    serviceImage:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.model("Service",serviceSchema);