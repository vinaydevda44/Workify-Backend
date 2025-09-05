const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

//Database connection
const DATABASE = require('./config/db');
DATABASE.dbConnect();

//Routes
const userRoutes = require('./routes/userRoute');
const serviceRoutes=require('./routes/serviceRoute');
const bookingRoutes=require('./routes/bookingRoute');

app.use('/api/auth',userRoutes);
app.use('/api/service',serviceRoutes);
app.use('/api/booking',bookingRoutes);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
