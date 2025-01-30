import sharp from 'sharp';
import errorHandler from '../middleware/error_logs/errorHandler.js'
import cloudinary from '../utils/cloudinary.js';
import postModel from '../models/post.model.js';
import userModel from '../models/user.model.js';
import commentModel from '../models/comment.model.js';
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

 //! add comments
 export const addComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id; // Use req.user.id instead of req.id
        const { text } = req.body;

        if (!text) {
            return errorHandler(res, 400, "Text is required");
        }

        // Find post
        const post = await postModel.findById(postId);
        if (!post) {
            return errorHandler(res, 404, "Post not found");
        }

        // Create comment
        let comment = new commentModel({
            text,
            author: userId,
            post: postId,
        });

        // Save comment and post
        post.comments.push(comment._id);
        await Promise.all([post.save(), comment.save()]);

        // Populate author details AFTER saving
        comment = await comment.populate("author", "username profilePicture");

        return res.status(200).json({
            success: true,
            message: "Comment added",
            comment,
        });
    } catch (err) {
        return errorHandler(res, 500, `Server error: ${err.message}`);
    }
};

//! getcommentsofpost
export const getCommentsOfPost=async (req,res)=>{
    try {
        const postId=req.params.id;
        const comments=await commentModel.find({post:postId}).populate('author','username, profilePicture')
        if(!comments){
            return errorHandler(res,404,"no comments for this post")
        }
        return errorHandler(res,200,"comments sucess",comments)
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}
//! delete post
export const deletePost=async (req,res)=>{
    try {
        const postId=req.params.id;
        const userId=req.id;
        const post = await postModel.findById(postId)
        if(!post){
            return errorHandler(res,404,"post not found")
        }
        // check if the logged in user is the owner of the post
        if(post.author.toString()!==userId){
            return errorHandler(res,403,"Unauthorized");
        }
        await postModel.findByIdAndDelete(postId)

        // remove the post id from the user's post
        let user=await userModel.findById(userId)
        user.posts= user.posts.filter(id=>id.toString()!==postId)
        await user.save()

        // delete associated comments
        await commentModel.deleteMany({post:postId})

        return errorHandler(res,200,"post deleted")
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}
//! bookmark 
export const bookmarkPost=async (req,res)=>{
    try {
        const postId=req.params.id;
        const userId=req.id;
        const post=await postModel.findById(postId)
        if(!post){
            return errorHandler(res,404,"post not found")
        }
        const user=await userModel.findById(userId)
        if(user.bookmarks.includes(post._id)){
            // already bookmarks
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save()
            return errorHandler(res,200,"post remove form bookmarks")
        }else{
            await user.updateOne({$addToSet:{bookmarks:post._id}})
            await  user.save();
            return errorHandler(res,200,"post bookmarked")
        }
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}
