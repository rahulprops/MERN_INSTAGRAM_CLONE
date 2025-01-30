import express from 'express'
import isAuthenticated from '../middleware/auth/isAuthenticated.js'
import { sendMessage } from '../controller/message.controller.js'
const messageRouter=express.Router()

messageRouter.post("/create/:id", isAuthenticated,sendMessage)
export default messageRouter;