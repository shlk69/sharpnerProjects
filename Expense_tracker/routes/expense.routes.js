import { createExpense, getAllExpenses, deleteExpense } from "../controllers/expense.controller.js";
import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router()

// verifyToken runs first on every expense route — decodes JWT and puts userId on req.user
router.route('/add-expenses').post(verifyToken, createExpense)
router.route('/all-expenses').get(verifyToken, getAllExpenses)
router.route('/delete/:id').delete(verifyToken, deleteExpense)

export default router