import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv/config'
import { Brevo, BrevoClient } from '@getbrevo/brevo'
import User from '../models/user.model.js'



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


const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }

        const existingUser = await User.findOne({
            where: { email }
        })

        if (existingUser) {
            return res.status(403).json({
                error: 'User already exists, login to your account!'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: 'User created successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            })
        }

        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({
                error: 'Email or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                error: 'Email or password is incorrect'
            })
        }

        const token = generateToken(user)

        return res.status(200).json({
            message: 'Login successful',
            token
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const sendPassResetLink = async (req, res) => {
    try {
        const { email } = req.body
        if (!body) return res.status(400).json('Please enter a valid email')
        
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(401).json({ message: 'Email not found' })
        
        const unhashedToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto
            .createHash('sha256')
            .update(unhashedToken)
            .digest('hex')
        
        const resetToken = hashedToken
        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()


        const resetLink = `${process.env.APP_URL}/index.html?token=${rawToken}`
        const apiInstance = new Brevo.transactionalEmails()
        apiInstance.setApiKey(
            Brevo.transactionalEmails.apikey,
            process.env.BREVO_API_KEY
        )
        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.FROM_EMAIL,
                name: process.env.FROM_NAME
            },
            to: [{ email }],
            subject: 'Reset your password',
            htmlContent: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
        }); 
        return res.json({
            message: 'If an account exists, a reset link has been sent.'
        });

    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });

    }
}

export {
    signupUser,
    loginUser,
    sendPassResetLink
}