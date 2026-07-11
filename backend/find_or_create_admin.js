import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/Blogwebsite";

mongoose.connect(mongoUri).then(async () => {
    try {
        console.log("Connected to MongoDB at:", mongoUri);

        let admin = await User.findOne({ role: "admin" });

        if (admin) {
            console.log("Found existing admin user:");
            console.log(`Username: ${admin.userName}`);
            console.log(`Email: ${admin.email}`);

            // Reset the password to admin123 so you can log in easily
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash("admin123", salt);
            await admin.save();
            console.log("\nPassword reset successfully to: admin123");
        } else {
            console.log("No admin user found. Creating a new admin user...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);

            admin = await User.create({
                userName: "admin",
                email: "admin@techtales.com",
                password: hashedPassword,
                role: "admin"
            });

            console.log("\nAdmin user created successfully!");
            console.log("Username: admin");
            console.log("Email: admin@techtales.com");
            console.log("Password: admin123");
        }
    } catch (err) {
        console.error("Error finding/creating admin user:", err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
});
