import { Chat } from '../models/chat.model.js'

export const createChat = async (req, res) => {
    try {
        const { message } = req.body
        const chat = await Chat.create({
            message,
            userId:req.user.id
        })
        res.status(201).json({
            success: true,
            chat,
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}