import { createUser, loginUser } from "../controllers/user.controllers.js";
import { userDetailsValidator, loginValidator } from '../validators/index.js'
import express from "express";

const router = express.Router()

router.post(
    '/sign-up',
    userDetailsValidator(),
    createUser
)

router.post(
    '/login',
    loginValidator(),
    loginUser
)

export default router