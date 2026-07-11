import express from 'express';
import { protect, verifyRoles } from '../middleware/authMiddleware.js';
import { getAdminBlogs, toggleBlogVisibility, deleteBlogAdmin } from '../controllers/AdminBlogApi.js';

const adminRouter = express.Router();

// Get all blogs (including hidden ones)
adminRouter.get('/blogs', protect, verifyRoles(['admin']), getAdminBlogs);

// Toggle blog visibility
adminRouter.patch('/blogs/:id/visibility', protect, verifyRoles(['admin']), toggleBlogVisibility);

// Delete blog
adminRouter.delete('/blogs/:id', protect, verifyRoles(['admin']), deleteBlogAdmin);

export default adminRouter;
