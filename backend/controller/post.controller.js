import sharp from 'sharp';
import errorHandler from '../middleware/error_logs/errorHandler.js'
import cloudinary from '../utils/cloudinary.js';
import postModel from '../models/post.model.js';
 
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
        if(post){
            await post.save()
            return errorHandler(res,201,"post create sucess",post)
        }else{
            return errorHandler(res,400,"post create failed")
        }
         
    } catch (err) {
        return errorHandler(res,500,`server error ${err.message}`)
    }
}