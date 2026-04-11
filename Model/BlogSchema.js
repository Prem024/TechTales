import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Title is required"],
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    content:{
        type:String,
        required:[true, "Content Cannot Be Empty"]
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tags:[String],

    category:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["draft","published"],
        default:"draft"
    },
    views:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Blog = mongoose.model("Blog", BlogSchema)
export default Blog