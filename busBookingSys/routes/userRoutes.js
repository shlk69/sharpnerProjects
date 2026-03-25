import express from 'express'
const router = express.Router()
import userController from '../controllers/userController.js'

router.get('/',userController.getAllUsers)
router.post('/add', userController.addUsers)

export default router