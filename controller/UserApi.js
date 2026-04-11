import User from "../Model/Userschema.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const registerUser = async(req, res) => {
    try {
        const {userName, email, password} = req.body

        if(!userName || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please Enter All Fields"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword
    })

        res.status(201).json({
            success:true,
            message:"User Registered Successfully",
            data:newUser
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email or Username already exists"
            });
        }

        res.status(500).json({
            success:false,
            message:"Failed To Register The User",
            error:error.message
        })
    }
}

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            success:true,
            message:`Welcome Back ${user.userName}`,
            data:{
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            },
            token
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Failed TO Login",
            error:error.message
        })
    }
}

export const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}