import mongoose from "mongoose";

const Dbcon = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/Blogwebsite");
        console.log("Database Connected Successfully");
        
    } catch (error) {
        console.log("Database Failed To Connect",error)
        process.exit(1);
    }
}

export default Dbcon