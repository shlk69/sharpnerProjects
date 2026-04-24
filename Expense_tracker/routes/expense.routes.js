import { Router } from 'express'
import verifyToken from '../middlewares/auth.middleware.js'

import {
    createExpense,
    getAllExpenses,
    deleteExpense
} from '../controllers/expense.controller.js'

const router = Router()


// Add new expense
router.post('/add-expenses', verifyToken, createExpense)

// Get logged in user's expenses
router.get('/all-expenses', verifyToken, getAllExpenses)

// Delete expense by id
router.delete('/delete/:id', verifyToken, deleteExpense)

export default router

