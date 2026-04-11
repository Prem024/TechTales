import slugify from "slugify"
import Blog from "../Model/BlogSchema.js"


export const CreateBlog = async(req, res) => {
    try {
        const {title, slug, content, tags, category, status } = req.body
        const author = req.user._id;

        
        
        if(!title || !content || !category){
            return res.status(400).json({
                success:false,
                message:"Please Provide All Required Fields"
            })
        }

        const finalSlug = req.body.slug || slugify(title, { lower: true, strict: true });

        const newBlog = await Blog.create({
            title,
            slug:finalSlug,
            content,
            author,
            tags,
            category,
            status
        })

        res.status(201).json({
            success:true,
            message:"Blog Created Successfully",
            data:newBlog
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Title or Slug already exists" 
            });
        }
        res.status(500).json({
            success:false,
            message:"Failed To Create Blog",
            error:error.message
        })
    }
}

export const getAllBlog = async(req, res) => {
    try {
        const allBlog = await Blog.find().populate("author", "userName profileImage");

    if(allBlog.length === 0) { 
        return res.status(404).json({
        success: false,
        message: "No Blogs Found"
        });
    }

        res.status(200).json({
            success:true,
            count:allBlog.length,
            data:allBlog
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed To Fetch The Blog",
            error:error.message
        })
    }
}

export const blogByID = async(req, res) => {
    try {
        const single = req.params.id
        const singleBlog = await Blog.findById(single);

        if(!singleBlog){
            return res.status(404).json({
                success:false,
                message:"Blog Not Found"
            })
        }

        res.status(200).json({
            success:true,
            data:singleBlog
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error To Fetch the Blog",
            error:error.message
        })
    }
}

export const blogUpdate = async(req, res) => {
    try {
        const singleid = req.params.id
        const blogUpdated = await Blog.findByIdAndUpdate(
            singleid,
            req.body,
            {new:true}
        )

        if(!blogUpdated){
            return res.status(404).json({
                success:false,
                message:"Blog Not Found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Blog Updated Successfully",
            data:blogUpdated
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed To Update The Blog",
            error:error.message
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

// export const blogDelete = async(req, res) => {
//     try {
//         const singleID = req.params.id
//         const blogDeleted = await Blog.findByIdAndDelete(singleID)

//         if(!blogDeleted){
//             return res.status(404).json({
//                 success:false,
//                 message:"Blog Not Found"
//             })
//         }

//         res.status(200).json({
//             success:true,
//             message:"Blog Successfully Deleted",
//             data:blogDeleted
//         })
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message:"Failed To Delete The Blog",
//             error:error.message
//         })
//     }
// }