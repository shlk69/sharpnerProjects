import Expense from "../models/expense.model.js";

const createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body
        const userId = req.user.id   // extracted from the verified JWT by middleware

        const expense = await Expense.create({ amount, description, category, userId })
        if (!expense) return res.status(400).json('Unable to add expense')
        res.status(201).json('Expense added successfully')
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const userId = req.user.id   // extracted from the verified JWT by middleware

        const expenses = await Expense.findAll({ where: { userId } })
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Expense.destroy({ where: { id } })
        if (!deleted) return res.status(404).json({ error: 'Expense not found' })
        res.status(200).json({ message: 'Expense deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export { createExpense, getAllExpenses, deleteExpense }