const express = require("express");

const app = express();
app.use(express.json());

//Database connection
const DATABASE = require('./config/db');
DATABASE.dbConnect();

//Routes
const userRoutes = require('./routes/userRoute');
const serviceRoutes=require('./routes/serviceRoute');

app.use('/api/auth',userRoutes);
app.use('/api/',serviceRoutes);


const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
