import { Cashfree, CFEnvironment } from 'cashfree-pg'
import jwt from 'jsonwebtoken'
import { fn, col, literal } from 'sequelize'

import Order from '../models/order.model.js'
import User from '../models/user.model.js'
import Expense from '../models/expense.model.js'



const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
)



function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            isPremiumUser: user.isPremiumUser
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}


const createPremiumOrder = async (req, res) => {
    try {
        const userId = req.user.id
        const orderId = `order_${Date.now()}`

        const user = await User.findByPk(userId)

        const request = {
            order_id: orderId,
            order_amount: 99,
            order_currency: 'INR',
            customer_details: {
                customer_id: String(user.id),
                customer_name: user.name,
                customer_email: user.email,
                customer_phone: '9999999999'
            }
        }

        const response = await cashfree.PGCreateOrder(request)

        await Order.create({
            orderId,
            status: 'PENDING',
            userId
        })

        return res.status(200).json({
            paymentSessionId: response.data.payment_session_id,
            orderId
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


const verifyPremiumPayment = async (req, res) => {
    try {
        const { orderId } = req.body
        const userId = req.user.id

        const order = await Order.findOne({
            where: { orderId, userId }
        })

        if (!order) {
            return res.status(404).json({
                error: 'Order not found'
            })
        }

        const payment = await cashfree.PGOrderFetchPayments(orderId)

        const paymentStatus = payment.data?.[0]?.payment_status

        if (paymentStatus === 'SUCCESS') {
            await order.update({
                status: 'SUCCESSFUL'
            })

            await User.update(
                { isPremiumUser: true },
                { where: { id: userId } }
            )

            const updatedUser = await User.findByPk(userId)

            const token = generateToken(updatedUser)

            return res.status(200).json({
                success: true,
                token
            })
        }

        await order.update({
            status: 'FAILED'
        })

        return res.status(200).json({
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}



const getLeaderboard = async (req, res) => {
    try {
        if (!req.user.isPremiumUser) {
            return res.status(403).json({
                error: 'Premium membership required'
            })
        }

        const users = await User.findAll({
            attributes: ['name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']],
            raw: true
        })

        return res.status(200).json(
            users.map(user => ({
                name: user.name,
                totalAmount: Number(user.totalExpenses || 0)
            }))
        )

    } catch (error) {
        console.log('Leaderboard Error:', error)
        return res.status(500).json({
            error: error.message
        })
    }
}


export {
    createPremiumOrder,
    verifyPremiumPayment,
    getLeaderboard
}