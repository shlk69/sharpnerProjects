import express from 'express'
const router = express.Router()
import userController from '../controllers/userController.js'

router.post('/add', userController.addUsers)
router.get('/',userController.getAllUsers)

export default router