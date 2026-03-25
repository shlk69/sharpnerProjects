import express from 'express'
const router = express.Router()
import busController from '../controllers/busController.js'


router.post('/add',busController.addBuses)
router.get('/available/:seats', busController.getBusByNum)

export default router