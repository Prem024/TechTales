import Comment from "../models/CommentModel.js"

export const addComment = async(req, res) => {
    try {

        const { content, BlogId } = req.body 
        const authorId = req.user._id;

        if(!content || !BlogId){
            return res.status(400).json({
                success:false,
                message:"Missing Required Fields"
            })
        }

        const newComment = await Comment.create({
            content,
            blogId: BlogId, 
            authorId: authorId
        })

        res.status(201).json({
            success:true,
            message:"Comments Added Successfully",
            data:newComment
        })
// ... rest of code

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed To Add Comment",
            error:error.message
        })
    }
}

export const getBlogComment = async(req, res) => {
    try {
        const { BlogId } = req.params;

        
        const getcomments = await Comment.find({ blogId: BlogId }).populate("authorId", "userName profileImage");

        res.status(200).json({
            success:true,
            count:getcomments.length,
            data:getcomments
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Comments Failed To Fetch",
            error:error.message
        })
    }
}

// export const deleteComment = async(req, res) => {
//     try {
//         const deletedComment = await Comment.findByIdAndDelete(req.params.id)

//         if(!deletedComment){
//             return res.status(404).json({
//                 success:false,
//                 message:"Comment Not Found"
//             })
//         }

//         res.status(200).json({
//             success:true,
//             message:"Comment Deleted Successfully",
//         })
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message:"Failed To Delete Comment",
//             error:error.message
//         })
//     }
// }

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment Not Found" });
        }

        // Authorization check
        if (comment.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Comment Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}