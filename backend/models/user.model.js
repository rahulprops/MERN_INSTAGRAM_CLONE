import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
          type:String,
          required:true,
          unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        enum:["male","female"]
    },
    bio:{
        type:String,
        default:''
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    verify:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const userModel=mongoose.model("user",userSchema)
export default userModel;