import mongoose from "mongoose";
import Blog from "../models/BlogModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

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

        // Ensure admin user exists with the configured admin password
        try {
            const adminEmail = "admin@techtales.com";
            let admin = await User.findOne({ email: adminEmail });
            
            const salt = await bcrypt.genSalt(10);
            const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            
            if (admin) {
                let changed = false;
                if (admin.role !== "admin") {
                    admin.role = "admin";
                    changed = true;
                    console.log(`Promoted existing user ${adminEmail} to admin role.`);
                }
                // Automatically update password in the database if it doesn't match the configured adminPassword
                const isMatch = await bcrypt.compare(adminPassword, admin.password);
                if (!isMatch) {
                    admin.password = hashedPassword;
                    changed = true;
                    console.log("Admin password updated to match configured adminPassword.");
                }
                if (changed) {
                    await admin.save();
                }
            } else {
                await User.create({
                    userName: "admin",
                    email: adminEmail,
                    password: hashedPassword,
                    role: "admin"
                });
                console.log("Default admin user created successfully on database connection.");
            }
        } catch (adminErr) {
            console.error("Failed to seed admin user on startup:", adminErr.message);
        }

    } catch (error) {
        console.log("Database Failed To Connect", error)
        process.exit(1);
    }
}

export default Dbcon

