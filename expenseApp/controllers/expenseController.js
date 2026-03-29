import Expense from "../models/expenseModel.js";


const createExpense = async (req, res) => {
    try {
        const { expenseName, expenseAmount } = req.body
        const expense = await Expense.create({ expenseName, expenseAmount })
        res.status(200).json(expense)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}


const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll()
        if (!expenses) {
            return res.status(404).json({message:'Expense not found'})
        }
        res.status(200).json(expenses)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params
        const expense = await Expense.destroy({ where: { id } })
        if (expense === 0) return res.status(404).json({ message: 'Expense not found' });
        res.status(200).json({ message: `Expense id ${id} deleted successfully` })
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}


const updateExpense = async (req, res) => {
    try {
        const { id } = req.params
        const [updatedRowsCount] = await Expense.update(req.body, {
            where: { id }
        });
        if (updatedRowsCount === 0) return res.status(404).json({ message: 'Expense not found or no changes made' });

        res.status(201).json({ message: `Expense ${id} updated` })
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}


export default {
    createExpense,
    getAllExpenses,
    deleteExpense,
    updateExpense
}