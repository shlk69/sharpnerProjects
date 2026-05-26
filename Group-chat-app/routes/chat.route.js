import { createChat } from "../controllers/chat.controller.js";
import express from 'express'
const router = express.Router()

router.post('/chats', createChat)

export default router