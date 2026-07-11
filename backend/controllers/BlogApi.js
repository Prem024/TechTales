import slugify from "slugify"
import Blog from "../models/BlogModel.js"


export const CreateBlog = async (req, res) => {
    try {
        const { title, slug, content, tags, category, status } = req.body
        const author = req.user._id;



        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All Required Fields"
            })
        }

        const finalSlug = req.body.slug || slugify(title, { lower: true, strict: true });

        let featuredImage = "";
        if (req.file) {
            featuredImage = req.file.path;
        } else if (req.body.featuredImage) {
            featuredImage = req.body.featuredImage;
        }

        const newBlog = await Blog.create({
            title,
            slug: finalSlug,
            content,
            author,
            tags,
            category,
            status,
            featuredImage
        })

        res.status(201).json({
            success: true,
            message: "Blog Created Successfully",
            data: newBlog
        })
    } catch (error) {
        console.log("from catch block", error)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Title or Slug already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed To Create Blog",
            error: error.message
        })
    }
}

export const getAllBlog = async (req, res) => {
    try {
        let query = { is_visible: { $ne: false } };

        // If user is authenticated, also allow them to see their own hidden blogs
        if (req.user) {
            query = {
                $or: [
                    { is_visible: { $ne: false } },
                    { author: req.user._id }
                ]
            };
        }

        const allBlog = await Blog.find(query).populate("author", "userName profileImage");

        if (allBlog.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Blogs Found"
            });
        }

        res.status(200).json({
            success: true,
            count: allBlog.length,
            data: allBlog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed To Fetch The Blog",
            error: error.message
        })
    }
}

export const getPublicBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ is_visible: { $ne: false } }).populate("author", "userName profileImage");
        
        if (blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Blogs Found"
            });
        }

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch public blogs",
            error: error.message
        });
    }
};

export const blogByID = async (req, res) => {
    try {
        const single = req.params.id;
        const singleBlog = await Blog.findById(single).populate("author", "userName profileImage");

        if(!singleBlog){
            return res.status(404).json({
                success:false,
                message:"Blog Not Found"
            });
        }

        // If the blog is hidden, only the author or an admin can access it
        if (singleBlog.is_visible === false) {
            const isAuthorized = req.user && (
                req.user.role === 'admin' || 
                req.user._id.toString() === singleBlog.author._id.toString()
            );
            if (!isAuthorized) {
                return res.status(404).json({
                    success: false,
                    message: "Blog Not Found"
                });
            }
        }

        res.status(200).json({
            success: true,
            data: singleBlog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error To Fetch the Blog",
            error: error.message
        })
    }
}

export const blogUpdate = async (req, res) => {
    try {
        const singleid = req.params.id
        const updateData = { ...req.body };
        if (req.file) {
            updateData.featuredImage = req.file.path;
        }

        const blogUpdated = await Blog.findByIdAndUpdate(
            singleid,
            updateData,
            { new: true }
        )

        if (!blogUpdated) {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Blog Updated Successfully",
            data: blogUpdated
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed To Update The Blog",
            error: error.message
        })
    }
}
export const blogDelete = async (req, res) => {
    try {
        const singleID = req.params.id;
        const blog = await Blog.findById(singleID);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog Not Found" });
        }

        // Check if the logged-in user is the author
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            });
        }

        await Blog.findByIdAndDelete(singleID);

        res.status(200).json({
            success: true,
            message: "Blog Successfully Deleted"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const uploadInlineImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded"
            });
        }

        const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 6002}`;
        const cleanPath = req.file.path.replace(/\\/g, "/").replace(/^\//, "");
        const fileUrl = `${baseUrl}/${cleanPath}`;

        return res.status(200).json({
            success: true,
            url: fileUrl
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to upload inline image",
            error: error.message
        });
    }
};
