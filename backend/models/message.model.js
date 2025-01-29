import mongoose, { Schema } from "mongoose";

const messageSchema=new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true})
const messageModel=mongoose.model("message",messageSchema)
export default messageModel;