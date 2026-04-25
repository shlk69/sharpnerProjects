import { NUMBER } from 'sequelize'
import Expense from '../models/expense.model.js'
import User from '../models/user.model.js'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import sequelize from '../config/database.js'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
async function  main (desc) {
    const response = await ai.models.generateContent({
        "model": 'gemini-3-flash-preview',
        "contents":` description : ${desc} based on the given description , give me one category from Food,Petrol,Salary,Utilities,Entertainment , just give me the category not stars before nothing just the word which tells the category from given five of them `
    })
    return response.text.trim()
}


const createExpense = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        let { amount, description, category } = req.body
        const userId = req.user.id

        if (!amount || !description) {
            return res.status(400).json({
                error: 'All "*" fields are required'
            })
        }

        if (!category) {
            category = await main(description)
        }
        const expense = await Expense.create({
            amount,
            description,
            category,
            userId,
        }, {
            transaction:t
        })


        const user = await User.findByPk(userId)

        await user.update({
            totalExpenses:Number(user.totalExpenses) + Number(amount)
        },{transaction:t})

        return res.status(201).json({
            message: 'Expense added successfully',
            data: expense
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
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
    const t = await sequelize.transaction()
    try {
        const { id } = req.params
        const userId = req.user.id

        const expense = await Expense.findOne({
            where: {
                id,
                userId
            }
        }, {
            transaction:t
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
        }, {
            transaction:t
        })

        const user = await User.findByPk(userId)

        await user.update({
            totalExpenses: Math.max(
                0,
                Number(user.totalExpenses) - amountToSubtract
            )
        }, {
            transaction:t
        })

        return res.status(200).json({
            message: 'Expense deleted successfully'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
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