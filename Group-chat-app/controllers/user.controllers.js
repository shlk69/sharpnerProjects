import {User} from '../models/user.model.js'

const generateAccessAndToken = async (user) => {
    const refreshToken = await generateRefreshToken(user)
    const accessToken = await generateAccessToken(user)
    user.refreshToken = refreshToken
    await user.save()
    return {refreshToken , accessToken}
}
const createUser = async (req, res) => {
    const { email, phoneNumber, password, name } = req.body
    try {
        const existingUser = await User.findOne({
            where: {
                email
            }
        })
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists'
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
            user,
            accessToken,
            message: 'User registered successfully'
        })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
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
                message: 'User not found , register first'
            })
        }

        const isPassValid = await user.isPasswordCorrect(password)
        if (!isPassValid) {
            return res.status(400).json({
                message:'Invalid credentials'
            })
        }

        const { accessToken } = await generateAccessAndToken(user)
       

        const loggedInUser = user.toJSON()

        return res.status(200).json({
            message: 'User logged in successfully',
            accessToken,
            loggedInUser
        })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}


export {createUser,loginUser}