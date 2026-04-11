import express from "express";
import { blogByID, blogDelete, blogUpdate, CreateBlog, getAllBlog } from "../controller/BlogApi.js";
import { protect } from "../middleware/authMiddleware.js";

const blogRouter = express.Router();
blogRouter.post("/create", protect, CreateBlog)
blogRouter.get("/", getAllBlog)
blogRouter.get("/:id", blogByID)
blogRouter.put("/update/:id", protect, blogUpdate)
blogRouter.delete("/delete/:id", protect, blogDelete)

export default blogRouter