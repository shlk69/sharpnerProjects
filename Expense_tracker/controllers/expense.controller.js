import Expense from "../models/expense.model.js";

const createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body
        const expense = await Expense.create({
            amount,
            description,
            category
        })
        if (!expense) return res.status(400).json('Unable to add expense')
        res.status(201).json('Expense added successfully')
    } catch (error) {
        console.log(error.message)
        res.status(401).json({error:error.message})
    }
}


const getAllExpenses = async (req,res) => {
    try {
        const expenses = await Expense.findAll()
        if (!expenses)  return res.status(400).json('Unable to fetch expenses')
        
        res.status(201).json(expenses)
    } catch (error) {
        res.status(500).json({error:error.message})
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