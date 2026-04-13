import express from "express";
import { addComment, deleteComment, getBlogComment } from "../controllers/CommentApi.js";
import { protect } from "../middleware/authMiddleware.js";

const commentRouter = express.Router()
commentRouter.post("/add", protect, addComment)
commentRouter.get("/:BlogId", getBlogComment)
commentRouter.delete("/delete/:id", protect, deleteComment)

export default commentRouter