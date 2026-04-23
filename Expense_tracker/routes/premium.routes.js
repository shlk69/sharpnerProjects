import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
    createPremiumOrder,
    verifyPremiumPayment
} from "../controllers/premium.controller.js";

const router = Router();

router.route('/create-order').post(verifyToken, createPremiumOrder);
router.route('/verify-payment').post (verifyToken, verifyPremiumPayment);

export default router;