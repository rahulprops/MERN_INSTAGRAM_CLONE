import validator from 'validator'
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt'
import generateToken from '../config/generatetoken.js';
import errorHandler from '../middleware/error_logs/errorHandler.js';
import mongoose from 'mongoose';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { verification } from '../middleware/mailsend/mailSend.js';
//! register user 
export const register= async (req,res)=>{
    const {username,email,password,gender}=req.body;
    if(!username || !email || !password || !gender){
        return res.status(400).json({
            message:"all feild requied"
        })
    }

    // check email valid or not
    if(!validator.isEmail(email)){
        return res.status(400).json({
            message:"please enter valid email"
        })

    }

    try {
        // check user exist or not
        const user = await userModel.findOne({email})
        if(user && user.verify){
            return res.status(400).json({message:"already user exists"})
        }
        if(user && !user.verify){
            await userModel.deleteOne(user)
        }
        // password hashing 
         const hashPass=await bcrypt.hash(password , 12)
         //create user
         const newuser=new userModel({
            username,
            email,
            password:hashPass,
            gender,
         })
         if(newuser){
            generateToken(newuser._id,res)
           await newuser.save()
           return res.status(201).json({
            message:"new user create",
            data:newuser
           })
          
         }else{
            return res.status(400).json({
                message:"create user failed"
            })
         }
        
    } catch (err) {
     return res.status(500).json({
        message:`server error ${err.message}`
     })
    }
}

//! veriy user
export const verifyUser = async (req, res) => {
    const { email, token } = req.params;

    if (!email || !token) {
        return errorHandler(res, 400, "Invalid credentials");
    }

    // console.log("Email:", email);
    // console.log("Token:", token);

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return errorHandler(res, 400, "User not found");
        }

        // console.log("Stored Verification Data:", verification[email]);

    
        if (!verification[email] || verification[email].expires < Date.now()) {
            return errorHandler(res, 400, "Link has expired");
        }

        
        if (verification[email].token !== token) {
            return errorHandler(res, 400, "Invalid token");
        }

        // ✅ Verify user and remove verification data
        user.verify = true;
        await user.save();
        delete verification[email]; // Remove from stored tokens

        return errorHandler(res, 200, "User verified successfully");
    } catch (err) {
        return errorHandler(res, 500, `Server error: ${err.message}`);
    }
};

//! login user
export const login=async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return errorHandler(res,400,"all feilds requied")
    }
    if(!validator.isEmail(email)){
        return errorHandler(res,400,"please enter valid email")
    }
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return errorHandler(res,400,"email not valid")
        }
        if(!user.verify){
           return errorHandler(res,400,"user not verified")
        }

        // compare password
        const verifyPass=await bcrypt.compare(password,user.password)
        if(!verifyPass){
            return errorHandler(res,400,"please enter valid passwor")
        }
        generateToken(user._id,res)
        return errorHandler(res,200,"user login sucessful",user)
    }catch(err){
      return errorHandler(res,500,`server error ${err.message}`)
    }
}

//! logout
export const logout= async (req,res)=>{
    try {
         res.cookie("refreshToken","",{maxAge:0})
         return errorHandler(res,200,"logout sucess")
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}

//! getProfile
export const getProfile=async (req,res)=>{
    const userId=req.params.id
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return errorHandler(res,400,"please enter valid id")
    }
    try {
        const user=await userModel.findById(userId).select("-password").populate({path:'posts',createAt:-1}).populate("bookmarks")
        return errorHandler(res,200,"get profile sucess",user)
    } catch (err) {
      return errorHandler(res,500,`server error ${err.message}`)        
    }
}
//!edit proife 
export const editProfile = async (req, res) => {
    const userId = req.id; // Use `req.user.id` from authentication middleware
    const { bio } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    try {
        // Fetch user from DB
        const user = await userModel.findById(userId);
        if (!user) {
            return errorHandler(res, 404, "User not found");
        }

        // Upload new profile picture (if provided)
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            if (!fileUri) {
                return errorHandler(res, 400, "Invalid file format");
            }
            cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePicture = cloudResponse.secure_url;
        }

        // Update bio if provided
        if (bio) user.bio = bio;

        // Save updated user data
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        return errorHandler(res, 500, `Server error: ${err.message}`);
    }
};

//! get suggestedusers
export const getSuggestedUsers=async (req,res)=>{
    try {
         const suggestedUsers=await userModel.find({_id:{$ne:req.id}}).select("-password")
         if(!suggestedUsers){
            return errorHandler(res,400,"currently do not have any users")
         }

         return errorHandler(res,200,"done",suggestedUsers)
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
        
    }
}

//! follow and unfollow
export const followOrUnfollow=async (req,res)=>{
    const followId=req.id;
    const followingId=req.params.id;
    if(followId === followingId){
        return errorHandler(res,400,"you cant not follow/unfollow itself")
    }

    try {
        const user= await userModel.findById(followId)
        const targetUser=await userModel.findById(followingId)
        if(!user || !targetUser){
            return errorHandler(res,404,"user not found")
        }

        const isFollowing= user.following.includes(followingId)
        
        if(isFollowing){
           // unfollow
           await Promise.all([
            userModel.updateOne({_id:followId},{$pull:{following:followingId}}),
            userModel.updateOne({_id:followingId},{$pull:{followers:followId}})
        ])
        return errorHandler(res,200,"unfollow sucessfully")
        }else{
           // follow login 
            await Promise.all([
                userModel.updateOne({_id:followId},{$push:{following:followingId}}),
                userModel.updateOne({_id:followingId},{$push:{followers:followId}})
            ])
           return errorHandler(res,200,"follow sucessful") 
        }
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}