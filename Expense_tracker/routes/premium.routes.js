import { Router } from 'express'
import verifyToken from '../middlewares/auth.middleware.js'

import {
    createPremiumOrder,
    verifyPremiumPayment,
    getLeaderboard
} from '../controllers/premium.controller.js'

const router = Router()


// Create payment order
router.post('/create-order', verifyToken, createPremiumOrder)

// Verify payment and upgrade user
router.post('/verify-payment', verifyToken, verifyPremiumPayment)

// Premium leaderboard
router.get('/leaderboard', verifyToken, getLeaderboard)

export default router