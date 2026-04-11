import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        trim: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"],
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },

    profileImage: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User;