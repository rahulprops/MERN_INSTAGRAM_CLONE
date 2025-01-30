import express from 'express'
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from '../controller/user.controller.js'
import isAuthenticated from '../middleware/auth/isAuthenticated.js'
import upload from '../middleware/multer/multer.js'
const userRouter=express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/get-profile/:id",getProfile)
userRouter.put("/edit-profile",isAuthenticated, upload.single("profilePicture") ,editProfile)
userRouter.get("/suggested-users",isAuthenticated, getSuggestedUsers)
userRouter.post("/followorunfollow/:id",isAuthenticated, followOrUnfollow)
export default userRouter;