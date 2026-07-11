import User from "../models/UserModel.js"
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
        console.log("new user",newUser)
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

export const updateProfile = async(req, res) => {
    try {
        const {userName, password} = req.body
        console.log("Req.body>>>",req.body)

        const userid = req.params.id
        console.log("Userid>>>",userid)

        const user = await User.findById(userid);
        console.log("User >>>",user)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        const data = {
            userName
        }

        // Stores multiple images
        if(req.files && req.files.length > 0){
            data.profileImage = req.files.map(file => file.path)
        }

        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            data.password = hashedPassword
        }

        const updateUser = await User.findByIdAndUpdate(
            userid,
            data,
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            data:updateUser
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed To Update the User Profile",
            error:error.message
        })
    }
}

export const getallProfile = async(req, res) => {
    try {
        console.log("All Prfoles Api")
        
        const profiles = await User.find().select("-password")
        console.log("profiles ",profiles)

        if(!profiles || profiles.length === 0){
            return res.status(404).json({
                success:false,
                message:"No Profile Found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"User Fetched Successfully",
            data:profiles
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed To Fetch The User Profile",
            error:error.message
        })
    }
}

export const deleteUser = async(req, res) => {
    try {
        const userid = req.body;

        if(!userid){
            return res.status(404).json({
                success:false,
                message:"User Id Is Requires "
            })
        }

        let idtoDelete = [];

        if(Array.isArray(userid)){
            idtoDelete = userid
        }
        else{
            idtoDelete = [userid]
        }

        const result = await User.deleteMany({
            _id: { $in: idtoDelete}
        })

        if(!result.deletedCount === 0){
            return res.status(404).json({
                success:false,
                message:"No User Found To Delete "
            })
        }

        return res.status(200).json({
            success:true,
            message:"User'S Deleted Successfullt",
            data:result
        })


    } catch (error) {
        console.log("Error From Catch Block")
        return res.status(500).json({
            success:false,
            message:"Failed To Delete the User",
            error:error.message
        })
    }
}