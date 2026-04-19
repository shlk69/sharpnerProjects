import express from 'express'
import {createUser} from '../controllers/user.controller.js'
const router = express.Router()



router.route('/signup').post(createUser)


export default router