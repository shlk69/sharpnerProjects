import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret'

const generateAccessToken = async (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
}

const generateRefreshToken = async (user) => {
    return jwt.sign(
        { id: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
}

const generateAccessAndToken = async (user) => {
    const refreshToken = await generateRefreshToken(user)
    const accessToken = await generateAccessToken(user)
    user.refreshToken = refreshToken
    await user.save()
    return { refreshToken, accessToken }
}
const createUser = async (req, res) => {
    const { email, phoneNumber, password, name } = req.body
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email or phone number'
            })
        }
        const user = await User.create({
            name,
            email,
            phoneNumber,
            password,
        })
        const { accessToken } = await generateAccessAndToken(user)

        return res.status(201).json({
            success: true,
            user: user.toJSON(),
            accessToken,
            message: 'User registered successfully'
        })

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const loginUser = async (req, res) => {
    const { email, phoneNumber, password } = req.body
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    email ? { email } : null,
                    phoneNumber ? { phoneNumber } : null,
                ].filter(Boolean)
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found, register first'
            })
        }

        const isPassValid = await user.isPasswordCorrect(password)
        if (!isPassValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const { accessToken } = await generateAccessAndToken(user)
        const loggedInUser = user.toJSON()

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            accessToken,
            user: loggedInUser
        })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export { createUser, loginUser }