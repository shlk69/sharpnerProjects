import User from '../models/user.model.js'

const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const userExists = await User.findOne({ where: { email } })
        if (userExists) {
            return res.status(403).json({error:`User already exists , login to your account!`})
        }
        const user = await User.create({
            name, email, password
        })
        res.status(200).json({data:user,message:'User created successfully'})
    } catch (error) {
        
        res.status(401).json({error:error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user || user.password !== password) {
            return res.status(401).json({
                error: 'Email or password is incorrect'
            })
        }

        return res.status(200).json({
            message: 'Login successful'
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}
export { signupUser,loginUser }