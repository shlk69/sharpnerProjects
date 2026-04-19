import User from '../models/user.model.js'

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await User.create({
            name, email, password
        })
        res.status(200).json({data:user,message:'User created successfully'})
    } catch (error) {
        
        res.status(401).json({error:error.message})
    }
}

export {createUser}