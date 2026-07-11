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
const allowedOrigins = [
    "http://localhost:5173",
    "https://tech-tales-five.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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
