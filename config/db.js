const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect= async ()=>{
    mongoose.connect(process.env.MONGO_DB,)
    .then(()=>{
        console.log("DATABASE CONNECTED");
    })
    .catch((err)=>{
        console.log("DATABASE CONNECTION FAILED",err);
        process.exit(1);
    })
}

