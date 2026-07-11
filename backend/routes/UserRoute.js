import express from "express";
import { getUserProfile, loginUser, registerUser, updateProfile } from "../controllers/UserApi.js";
import { uploadImages } from "../middleware/Multer.js";

const userRouter = express.Router();
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile/:id",getUserProfile)
userRouter.put("/profile/update/:id", uploadImages, updateProfile)

export default userRouter