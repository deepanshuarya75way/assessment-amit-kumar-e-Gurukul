// import express from "express";

// const app = express();
// const PORT = 5000;

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize Express

const app = express();

// Connect to db

await connectDB();

// middlewares

app.use(cors());

//Routes

app.get("/", (req, res) => res.send("API Working"));

app.post("/clerk", express.json(), clerkWebhooks);

// Port

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
