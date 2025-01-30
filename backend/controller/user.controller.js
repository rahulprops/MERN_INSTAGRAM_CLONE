import validator from 'validator'
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt'
import generateToken from '../config/generatetoken.js';
import errorHandler from '../middleware/error_logs/errorHandler.js';
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
        if(user){
            return res.status(400).json({message:"already user exists"})
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
         res.cookie("token","",{maxAge:0})
         return errorHandler(res,200,"logout sucess")
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}