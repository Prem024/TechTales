import mongoose from "mongoose";
import User from "./models/UserModel.js";

mongoose.connect("mongodb://localhost:27017/Blogwebsite").then(async () => {
    const users = await User.find({});
    console.log(users);
    process.exit();
});
