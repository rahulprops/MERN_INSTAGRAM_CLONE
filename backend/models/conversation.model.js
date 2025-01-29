import mongoose, { Schema } from "mongoose";

const conversationSchema=new Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message"
    }]
},{timestamps:true})
const conversationModel=mongoose.model("conversation",conversationSchema)
export default conversationModel;