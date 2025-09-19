const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload= require('express-fileupload');
require('dotenv').config();


app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}));


app.use(express.json());
app.use(cookieParser());

//CLOUDINARY CONNECTION
const CLOUDINARY= require("./config/cloudinary");
CLOUDINARY.cloudinaryConnect();

//Database connection
const DATABASE = require('./config/db');
DATABASE.dbConnect();

//Routes
const userRoutes = require('./routes/userRoute');
const serviceRoutes=require('./routes/serviceRoute');
const bookingRoutes=require('./routes/bookingRoute');
const reviewRoutes=require('./routes/reviewRoute');


app.use('/api/auth',userRoutes);
app.use('/api/service',serviceRoutes);
app.use('/api/booking',bookingRoutes);
app.use('/api/review',reviewRoutes);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
