import { createExpense, getAllExpenses, deleteExpense } from "../controllers/expense.controller.js";
import { Router } from "express";
const router = Router()

router.route('/add-expenses').post(createExpense)
router.route('/all-expenses').get(getAllExpenses)
router.route('/delete/:id').delete(deleteExpense)  

export default router