require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss=require("xss-clean");
const rateLimit= require("express-rate-limit");



const mongoose= require("mongoose");
const express = require('express');
const app = express();

// routes
const jobsRouter= require("./routes/jobs");
const authRouter= require("./routes/auth");
const authUser = require("./middleware/authentication");

// connect db
const connect = require("./db/connect");

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(rateLimit({
  windowMs:15*60*1000,//15 minutes
  max:100, //limit each IP to 100 requests per windowMs
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.get("/",(req,res)=>{
  res.send("Jobs api");
})
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/jobs",authUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
