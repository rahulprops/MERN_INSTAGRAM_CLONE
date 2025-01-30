import express from 'express'
import { addComments, addNewPost, getAllPost, likepost, unlikePost } from '../controller/post.controller.js'
import isAuthenticated from '../middleware/auth/isAuthenticated.js'
import upload from '../middleware/multer/multer.js'
const postRouter=express.Router()

postRouter.post("/create",isAuthenticated,upload.single("image"),addNewPost)
postRouter.get("/all-posts", getAllPost)
postRouter.get("/user-posts", isAuthenticated,getAllPost)
postRouter.post("/likes/:id", isAuthenticated,likepost)
postRouter.post("/dislike/:id", isAuthenticated, unlikePost)
postRouter.post("/add-comment/:id", isAuthenticated, addComments)
export default postRouter;