import express from 'express'
import { loginUser, signupUser } from '../controllers/user.controller.js'
import { forgotPassword, verifyResetRequest, resetPassword } from '../controllers/forgotPassReq.controller.js'

const router = express.Router()

router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:id').get(verifyResetRequest)
router.route('/resetpassword').post(resetPassword)

export default router