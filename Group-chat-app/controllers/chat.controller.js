import { Chat } from '../models/chat.model.js'

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'ASC']]
        })
        res.status(200).json({ success: true, chats })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export const createChat = async (req, res) => {
    try {
        const { message } = req.body
        const chat = await Chat.create({
            message,
            userId: req.user.id
        })
        res.status(201).json({ success: true, chat })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}