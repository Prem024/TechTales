import mongoose from "mongoose";
import Blog from "../models/BlogModel.js";

const Dbcon = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");

        // Run self-healing migration for existing blogs
        try {
            const result = await Blog.updateMany(
                { is_visible: { $exists: false } },
                { $set: { is_visible: true } }
            );
            if (result.modifiedCount > 0) {
                console.log(`Migrated ${result.modifiedCount} blogs to set is_visible: true`);
            }
        } catch (migErr) {
            console.error("Failed to run blog visibility migration:", migErr.message);
        }

    } catch (error) {
        console.log("Database Failed To Connect", error)
        process.exit(1);
    }
}

export default Dbcon

