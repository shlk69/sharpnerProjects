import { BrevoClient } from '@getbrevo/brevo'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config'
import User from '../models/user.model.js'
import PasswordReset from '../models/forgotPassReq.model.js'

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY })

const forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, message: "Email is required" })

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(404).json({ success: false, message: "No account found with this email" })

        const requestId = uuidv4()

        await PasswordReset.create({
            id: requestId,
            userId: user.id,
            isActive: true
        })

        const resetUrl = `${process.env.FRONTEND_URL}?id=${requestId}`

        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Reset Your Password",
            sender: { name: process.env.FROM_NAME || "Support", email: process.env.FROM_EMAIL },
            to: [{ email }],
            htmlContent: `
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h1>Password Reset Request</h1>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="background-color:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">
                        Reset Password
                    </a>
                    <p>This link can only be used once.</p>
                    <p>If you didn't request this, ignore this email.</p>
                </body>
                </html>
            `
        })

        return res.status(200).json({ success: true, message: "Reset link sent to your email!" })

    } catch (error) {
        console.error("Error:", error.message)
        return res.status(500).json({ success: false, message: "Something went wrong." })
    }
}

const verifyResetRequest = async (req, res) => {
    try {
        const { id } = req.params

        const request = await PasswordReset.findOne({ where: { id } })

        if (!request) {
            return res.status(400).json({ valid: false, message: "Invalid reset link" })
        }

        if (!request.isActive) {
            return res.status(400).json({ valid: false, message: "This link has already been used" })
        }

        return res.status(200).json({ valid: true })

    } catch (error) {
        return res.status(500).json({ valid: false, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { id, newPassword } = req.body

        if (!id || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const request = await PasswordReset.findOne({ where: { id } })

        if (!request) {
            return res.status(400).json({ error: 'Invalid reset link' })
        }

        if (!request.isActive) {
            return res.status(400).json({ error: 'This link has already been used' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await User.update(
            { password: hashedPassword },
            { where: { id: request.userId } }
        )

        await request.update({ isActive: false })

        return res.status(200).json({ message: 'Password reset successfully!' })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export { forgotPassword, verifyResetRequest, resetPassword }