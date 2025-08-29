const mongoose =require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',required:true
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required:true
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,max:5
    },
    comment:{
        type:String,
        default:""
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.model("Review",reviewSchema);