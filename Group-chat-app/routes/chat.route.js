import { createChat, getChats } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import express from 'express'

const router = express.Router()

router.get('/', verifyJWT, getChats)   
router.post('/', verifyJWT, createChat)

export default router