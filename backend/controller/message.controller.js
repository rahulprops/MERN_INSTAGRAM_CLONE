import errorHandler from '../middleware/error_logs/errorHandler.js'
import conversationModel from '../models/conversation.model.js'
import messageModel from '../models/message.model.js';
//! create message
export const sendMessage=async (req,res)=>{
    const senderId=req.id;
    const receiverId=req.params.id;
    const {message}=req.body;
    if(!message){
        return errorHandler(res,400,"message requird")
    }
    try {
        let conversation=await conversationModel.findOne({
           participants:{$all:[senderId,receiverId]} 
        })
        if(!conversation){
            conversation= await conversationModel.create({
                participants:[senderId,receiverId]
            })
        }
        const newMessage=await messageModel({
            senderId,
            receiverId,
            message,
        })
        if(newMessage){
        conversation.message.push(newMessage._id)
        await Promise.all([conversation.save(),newMessage.save()])

        // implement socet io
        return errorHandler(res,201,"new message",newMessage)
        }else{
            return errorHandler(res,400,"create message failed")
        }

        
    } catch (err) {
       return errorHandler(res,500,`server error ${err.message}`) 
    }
}