import { error } from "console";
import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "uploads")
    },
    filename : (req, file, cb) => {
        const uniquename = Date.now() + "_" + file.originalname ; 
        cb(null, uniquename);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedtypes = /jpeg|jpg|png/;
    const ext = allowedtypes.test(path.extname(file.originalname).toLowerCase())
    const mime = allowedtypes.test(file.mimetype)

    if (ext && mime){
        cb(null, true);
    }
    else{
        cb(new Error("Only Jpeg, Jpg, and Png are allowed"))
    }
}

const uploads = multer({
    storage,
    limits:{
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
})

export const uploadImages = (req, res, next) => {
    const uploader = uploads.array("images", 5)

    uploader(req, res, function(err){
        if(err instanceof multer.MulterError){
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }else if(err){
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }
        next()
    })
}

export const uploadBlogImage = (req, res, next) => {
    const uploader = uploads.single("featuredImage")

    uploader(req, res, function(err){
        if(err instanceof multer.MulterError){
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }else if(err){
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }
        next()
    })
}

export const uploadInline = (req, res, next) => {
    const uploader = uploads.single("image")

    uploader(req, res, function(err){
        if(err instanceof multer.MulterError){
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }else if(err){
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }
        next()
    })
}