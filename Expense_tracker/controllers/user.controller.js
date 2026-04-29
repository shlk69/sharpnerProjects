import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv/config'
import User from '../models/user.model.js'



function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            name:user.name,
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
            email:email.toLowerCase().trim(),
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


export {
    signupUser,
    loginUser
}