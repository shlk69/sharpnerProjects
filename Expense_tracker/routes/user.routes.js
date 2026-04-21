import express from 'express'
import {loginUser, signupUser} from '../controllers/user.controller.js'
const router = express.Router()



router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)


export default router