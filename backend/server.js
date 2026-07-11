import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

import Dbcon from "./config/Db.js";
import userRouter from "./routes/UserRoute.js";
import blogRouter from "./routes/BlogRoute.js";
import commentRouter from "./routes/CommentRoute.js";
import adminRouter from "./routes/AdminRoute.js";
import { getPublicBlogs } from "./controllers/BlogApi.js";

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Connect to Database
Dbcon();

// Middleware
// Update this section in your server.js
app.use(cors({
    origin: "http://localhost:5173", // update to permit local development, we will allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
app.use("/api/admin", adminRouter);
app.get("/api/blogs", getPublicBlogs);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is Running on Port: ${port}`);
});
