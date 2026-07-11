import fs from 'fs';
import path from 'path';
import Blog from '../models/BlogModel.js';

export const getAdminBlogs = async (req, res) => {
    try {
        const { search, category, status, sort, page = 1, limit = 10 } = req.query;
        const query = {};

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by status (Visible / Hidden)
        if (status === "visible") {
            query.is_visible = { $ne: false };
        } else if (status === "hidden") {
            query.is_visible = false;
        }

        // Sort option
        let sortOption = { createdAt: -1 }; // newest by default
        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        // Pagination calculations
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const totalBlogs = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .populate("author", "userName profileImage")
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        // Get list of all distinct categories in the database for the filter dropdown
        const categories = await Blog.distinct("category");

        res.status(200).json({
            success: true,
            blogs,
            totalPages: Math.ceil(totalBlogs / parseInt(limit)),
            currentPage: parseInt(page),
            totalBlogs,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin blogs",
            error: error.message
        });
    }
};

export const toggleBlogVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_visible } = req.body;

        if (typeof is_visible !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "is_visible field must be a boolean"
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { is_visible },
            { new: true }
        ).populate("author", "userName profileImage");

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Blog is now ${is_visible ? 'visible' : 'hidden'}`,
            data: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to toggle blog visibility",
            error: error.message
        });
    }
};

export const deleteBlogAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Delete associated image(s) if applicable
        // 1. Delete featuredImage if it is not placeholder and is local
        if (blog.featuredImage && blog.featuredImage !== "uploads/placeholder.png" && !blog.featuredImage.startsWith("http")) {
            const cleanPath = blog.featuredImage.replace(/\\/g, "/").replace(/^\//, "");
            const resolvedPath = path.resolve(cleanPath);
            fs.unlink(resolvedPath, (err) => {
                if (err) console.error("Error deleting featured image file:", err.message);
            });
        }

        // 2. Parse inline images in blog.content and delete them if they are local uploads
        const regex = /uploads[\\/][a-zA-Z0-9_-]+\.[a-zA-Z0-9]+/g;
        const matches = blog.content ? blog.content.match(regex) : null;
        if (matches) {
            matches.forEach(imagePath => {
                const cleanInlinePath = imagePath.replace(/\\/g, "/").replace(/^\//, "");
                const resolvedInlinePath = path.resolve(cleanInlinePath);
                fs.unlink(resolvedInlinePath, (err) => {
                    if (err) console.error("Error deleting inline image file:", resolvedInlinePath, err.message);
                });
            });
        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog permanently deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: error.message
        });
    }
};
