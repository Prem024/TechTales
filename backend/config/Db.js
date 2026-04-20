import mongoose from "mongoose";

const Dbcon = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");
        
    } catch (error) {
        console.log("Database Failed To Connect",error)
        process.exit(1);
    }
}


export default Dbcon