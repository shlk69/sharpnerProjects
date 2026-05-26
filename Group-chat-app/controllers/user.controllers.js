import { User } from '../models/user.model.js'
import { Op } from 'sequelize'

const generateAccessAndRefreshToken = async (user) => {
    const refreshToken = user.generateRefreshToken(user)
    const accessToken = user.generateAccessToken(user)

    user.refreshToken = refreshToken

    await user.save({ validate: false })

    return { refreshToken, accessToken }
}

const createUser = async (req, res) => {
    const { email, phoneNumber, password, name } = req.body

    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        })

        if (existingUser) {

            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                })
            }

            if (existingUser.phoneNumber === phoneNumber) {
                return res.status(409).json({
                    success: false,
                    message: 'Phone number already exists'
                })
            }
        }

        const user = await User.create({
            name,
            email,
            phoneNumber,
            password
        })

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user)

        const createdUser = user.toJSON()

        delete createdUser.password
        delete createdUser.refreshToken

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            accessToken,
            refreshToken,
            user: createdUser
        })

    } catch (error) {

        console.log("Signup Error:", error)

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const loginUser = async (req, res) => {

    const { email, phoneNumber, password } = req.body

    console.log(req.body)

    if (!password || (!email && !phoneNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Email/Phone and password are required'
        })
    }

    try {

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    email ? { email } : null,
                    phoneNumber ? { phoneNumber } : null
                ].filter(Boolean)
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const isPasswordCorrect =
            await user.isPasswordCorrect(password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user)

        const loggedInUser = user.toJSON()

        delete loggedInUser.password
        delete loggedInUser.refreshToken

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: loggedInUser
        })

    } catch (error) {

        console.log("Login Error:", error)

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export {
    createUser,
    loginUser
}