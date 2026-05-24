import { createUser, loginUser } from "../controllers/user.controllers.js";
import { userDetailsValidator } from '../validators/index.js'
import express from "express";

const router = express.Router()

router.post(
    '/sign-up',
    userDetailsValidator(),
    createUser
)

export default router