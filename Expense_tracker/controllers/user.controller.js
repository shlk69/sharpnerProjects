import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const userExists = await User.findOne({ where: { email } })
        if (userExists) {
            return res.status(403).json({ error: `User already exists , login to your account!` })
        }
        const hashedPass = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPass })
        res.status(200).json({ data: user, message: 'User created successfully' })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Email or password is incorrect' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Email or password is incorrect' })
        }

        // userId is encrypted inside this token — never sent raw to the frontend
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            message: 'Login successful',
            token
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}

export { signupUser, loginUser }