import { Router } from 'express'
import verifyToken from '../middlewares/auth.middleware.js'

import {
    createPremiumOrder,
    verifyPremiumPayment,
    getLeaderboard
} from '../controllers/premium.controller.js'

const router = Router()


router.post('/create-order', verifyToken, createPremiumOrder)

router.post('/verify-payment', verifyToken, verifyPremiumPayment)

router.get('/leaderboard', verifyToken, getLeaderboard)

export default router