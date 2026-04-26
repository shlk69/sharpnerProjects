import express from 'express'
import {loginUser, sendPassResetLink, signupUser} from '../controllers/user.controller.js'
const router = express.Router()



router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/forgotpassword').post(sendPassResetLink)


export default router