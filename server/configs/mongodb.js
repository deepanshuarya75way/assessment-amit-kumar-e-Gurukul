// import mongoose from "mongoose";

// // Connect to the MongoDB database

// const connectDB = async () => {
//   mongoose.connection.on("connected", () => console.log("Database Connected"));

//   await mongoose.connect(`${process.env.MONGODB_URI}/e-Gurukul`);
// };
// export default connectDB;

// server/configs/mongodb.js

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
