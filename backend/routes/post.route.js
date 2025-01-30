import express from 'express'
import { addNewPost } from '../controller/post.controller.js'
import isAuthenticated from '../middleware/auth/isAuthenticated.js'
import upload from '../middleware/multer/multer.js'
const postRouter=express.Router()

postRouter.post("/create",isAuthenticated,upload.single("image"),addNewPost)
export default postRouter;