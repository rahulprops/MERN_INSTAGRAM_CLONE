import sharp from 'sharp';
import errorHandler from '../middleware/error_logs/errorHandler.js'
import cloudinary from '../utils/cloudinary.js';
import postModel from '../models/post.model.js';
import userModel from '../models/user.model.js';
 //! create post
export const addNewPost=async (req,res)=>{
    const {caption}=req.body;
    const image=req.file;
    const autherId=req.id;
    if(!image){
        return errorHandler(res,400,"image requied")
    }
    try {
        // image upload
        const optimizedImageBuffer= await sharp(image.buffer)
        .resize({width:800,height:800,fit:'inside'})
        .toFormat('jpeg',{quality:80})
        .toBuffer();

        // buffer to data url
        const fileUri= `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse= await cloudinary.uploader.upload(fileUri);
        const post=new postModel({
            caption,
            image:cloudResponse.secure_url,
            author:autherId
        })

        const user=await userModel.findById(autherId)
        
        if(post){
            if(user){
                user.posts.push(post._id)
                await user.save()
            }
            
            await post.save()

            await post.populate({path:'author', select:"-password"})
            return errorHandler(res,201,"post create sucess",post)
        }else{
            return errorHandler(res,400,"post create failed")
        }
         
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}
//! getall post
 export const getAllPost=async (req,res)=>{
    try {
        const posts=await postModel.find().sort({createAt:-1}).populate({path:'author',select:'username,profilePicture'})
        .populate({
            path:"comments",
            sort:{createdAt:-1},
            populate:{
                path:"author",
                select:'username , profilePicture'
            }
        })
        return errorHandler(res,200,"get post",posts)
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
 }
 //!get userspost
 export const getUserPost=async (req,res)=>{
    try {
        const authorId=req.id;
        const posts=await postModel.find({author:authorId}).sort({createAt:-1}).populate({
            path:"author",
            select:"username,profilePicture"
        })
        .populate({
            path:"comments",
            sort:{createdAt:-1},
            populate:{
                path:"author",
                select:'username , profilePicture'
            }
        })
        return errorHandler(res,200,"user posts",posts)
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
 }

 //! likes post
 export const likepost=async (req,res)=>{
    try {
        const userId=req.id;
        const postId=req.params.id;
        const post = await postModel.findById(postId)
        if(!post){
            return errorHandler(res,404,"post not found")
        }
        await post.updateOne({$addToSet:{likes:userId}})
        await post.save()
        // implement socket io for real time notfication
        return errorHandler(res,200,"post liked")
    } catch (error) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
 }
 //!unlike post
 export const unlikePost=async (req,res)=>{
    try {
         const userId=req.id;
         const postId=req.params.id;
         const post = await postModel.findById(postId)
         if(!post){
            return errorHandler(res,404,"post not found")
         }
         await post.updateOne({$pull:{likes:userId}})
         await post.save()
             // implement socket io for real time notfication
             
             return errorHandler(res,200,"post disliked")

    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
 }