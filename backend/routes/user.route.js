import express from 'express'
import { editProfile, getProfile, login, logout, register } from '../controller/user.controller.js'
import isAuthenticated from '../middleware/auth/isAuthenticated.js'
import upload from '../middleware/multer/multer.js'
const userRouter=express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/get-profile/:id",getProfile)
userRouter.put("/edit-profile",isAuthenticated, upload.single("profilePicture") ,editProfile)
export default userRouter;