const mongoose= require('mongoose');

const bookingSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',required:true
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required:'true'
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    bookingDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Confirmed","Completed","Cancelled"],
        default:"Pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = mongoose.model("Booking",bookingSchema);