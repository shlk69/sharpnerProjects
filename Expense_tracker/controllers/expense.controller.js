import { NUMBER } from 'sequelize'
import Expense from '../models/expense.model.js'
import User from '../models/user.model.js'


const createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body
        const userId = req.user.id

        if (!amount || !description || !category) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }
        const expense = await Expense.create({
            amount,
            description,
            category,
            userId,
        })


        const user = await Expense.findByPk(userId)

        await user.update({
            totalExpenses:Number(user.totalExpenses) + Number(amount)
        })

        return res.status(201).json({
            message: 'Expense added successfully',
            data: expense
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const getAllExpenses = async (req, res) => {
    try {
        const userId = req.user.id

        const expenses = await Expense.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        })

        return res.status(200).json(expenses)

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const expense = await Expense.findOne({
            where: {
                id,
                userId
            }
        })

        if (!expense) {
            return res.status(404).json({
                error: 'Expense not found'
            })
        }

        const amountToSubtract = Number(expense.amount)

        await Expense.destroy({
            where: {
                id,
                userId
            }
        })

        const user = await User.findByPk(userId)

        await user.update({
            totalExpenses: Math.max(
                0,
                Number(user.totalExpenses) - amountToSubtract
            )
        })

        return res.status(200).json({
            message: 'Expense deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

export {
    createExpense,
    getAllExpenses,
    deleteExpense
}