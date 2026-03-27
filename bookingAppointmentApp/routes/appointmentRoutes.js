import express from 'express'
const router = express.Router()
import controllers from '../controllers/appointmentController.js'

router.post('/',controllers.addUser)
router.get('/',controllers.getAllUsers)
router.put('/:id',controllers.updateUser)
router.post('/:id', controllers.removeUser)

export default router