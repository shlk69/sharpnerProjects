import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'


const generateAccessAndRefreshToken = async (user) => {
    const refreshToken = await user.generateRefreshToken(user)
    const accessToken = await user.generateAccessToken(user)
    user.refreshToken = refreshToken
    await user.save()
    return { refreshToken, accessToken }
}

const createUser = async (req, res) => {
    const { email, phoneNumber, password, name } = req.body

    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            message: 'Registration rejected. Missing mandatory attributes.'
        });
    }

    try {
        const structuralConflictCheck = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        })

        if (structuralConflictCheck) {
            let conflictMsg = 'An account with these matching details already exists.';
            if (structuralConflictCheck.email === email) {
                conflictMsg = 'This email address is already registered to an account.';
            } else if (structuralConflictCheck.phoneNumber === phoneNumber) {
                conflictMsg = 'This phone number is already registered to an account.';
            }

            return res.status(409).json({
                success: false,
                message: conflictMsg
            })
        }

        const user = await User.create({
            name,
            email,
            phoneNumber,
            password,
        })

        const { accessToken } = await generateAccessAndRefreshToken(user)

        return res.status(201).json({
            success: true,
            user: user.toJSON(),
            accessToken,
            message: 'User identity generated securely.'
        })

    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server exception encountered during validation process.'
        });
    }
}

const loginUser = async (req, res) => {
    const { email, phoneNumber, password } = req.body

    if (!password || (!email && !phoneNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Credentials structure incomplete.'
        });
    }

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
                message: 'No profile matches these identifiers. Register first.'
            })
        }

        const isPassValid = await user.isPasswordCorrect(password)
        if (!isPassValid) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect verification password or email . Please try again.'
            })
        }

        const { accessToken } = await generateAccessAndRefreshToken(user)
        const loggedInUser = user.toJSON()

        delete loggedInUser.password;
        delete loggedInUser.refreshToken;

        return res.status(200).json({
            success: true,
            message: 'Access granted successfully.',
            accessToken,
            user: loggedInUser
        })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal authentication service timeout error.'
        });
    }
}

export {
    createUser,
    loginUser
}