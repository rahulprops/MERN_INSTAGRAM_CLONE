import mongoose, { Schema } from "mongoose";

const commentSchema=new Schema({
    text:{type:String,required:true},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    }
},{timestamps:true})
const commentModel=mongoose.model("comment",commentSchema)
export default commentModel;