import express from 'express'
import { ChatController } from '../controllers/ChatController.js'

export const router = express.Router()
const chatController = new ChatController()

router.post('/jsprompt', chatController.jsprompt)