import express from 'express'
import isAuthenticated from '../middleware/auth/isAuthenticated.js'
import { getMessage, sendMessage } from '../controller/message.controller.js'
const messageRouter=express.Router()

messageRouter.post("/create/:id", isAuthenticated,sendMessage)
messageRouter.get("/get/:id", isAuthenticated,getMessage)
export default messageRouter;