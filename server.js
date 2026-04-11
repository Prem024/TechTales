import express from "express"
import dotenv from "dotenv"

dotenv.config()

import Dbcon from "./config/Db.js";
import userRouter from "./Router/userRoute.js";
import blogRouter from "./Router/blogRoute.js";
import commentRouter from "./Router/commentRoute.js";


const app = express();
Dbcon();
app.use(express.json())
app.use("/api/user", userRouter)
app.use("/api/blog",blogRouter)
app.use("/api/comment", commentRouter)
const port = 6002;
app.listen(port,() => {
    console.log(`Server is Running on Port:${port}`)
})

