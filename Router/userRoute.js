import express from "express";
import { getUserProfile, loginUser, registerUser } from "../controller/UserApi.js";

const userRouter = express.Router();
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile/:id",getUserProfile)

export default userRouter