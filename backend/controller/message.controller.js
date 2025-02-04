import errorHandler from '../middleware/error_logs/errorHandler.js'
import conversationModel from '../models/conversation.model.js'
import messageModel from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
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
          const receiverSocketId=getReceiverSocketId(receiverId)

          if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage)
          }

        return errorHandler(res,201,"new message",newMessage)
        }else{
            return errorHandler(res,400,"create message failed")
        }

        
    } catch (err) {
       return errorHandler(res,500,`server error ${err.message}`) 
    }
}

//! get message
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id; // Use req.user.id instead of req.id
        const receiverId = req.params.id;

        // Find the conversation between the two users
        const conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: "message",
            populate: {
                path: "senderId receiverId",
                select: "username profilePicture"
            }
        });

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.message
        });

    } catch (err) {
        return errorHandler(res, 500, `Server error: ${err.message}`);
    }
};
