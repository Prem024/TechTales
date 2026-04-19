import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

import Dbcon from "./config/db.js";
import userRouter from "./routes/UserRoute.js";
import blogRouter from "./routes/BlogRoute.js";
import commentRouter from "./routes/CommentRoute.js";

const app = express();

// Connect to Database
Dbcon();

// Middleware
// Update this section in your server.js
app.use(cors({
    origin: "https://tech-tales-five.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is Running on Port: ${port}`);
});
