import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";

mongoose.connect("mongodb://localhost:27017/Blogwebsite").then(async () => {
    const users = await User.find({});
    for (let user of users) {
        if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
            console.log(`Fixing password for ${user.email}`);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
        }
    }
    console.log("Passwords fixed!");
    process.exit();
});
