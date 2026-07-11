import express from "express";
import { blogByID, blogDelete, blogUpdate, CreateBlog, getAllBlog, uploadInlineImage } from "../controllers/BlogApi.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import { uploadBlogImage, uploadInline } from "../middleware/Multer.js";

const blogRouter = express.Router();
blogRouter.post("/create", protect, uploadBlogImage, CreateBlog)
blogRouter.get("/", optionalProtect, getAllBlog)
blogRouter.get("/:id", optionalProtect, blogByID)
blogRouter.put("/update/:id", protect, uploadBlogImage, blogUpdate)
blogRouter.delete("/delete/:id", protect, blogDelete)
blogRouter.post("/upload-inline", protect, uploadInline, uploadInlineImage)

export default blogRouter