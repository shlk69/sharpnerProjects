import User from "../models/usersModel.js";

const addUsers = async (req, res) => {
    const { name, email,age } = req.body
    try {
        const user = await User.create({
            "name": name,
            "email": email,
            "age":age
        })
        console.log('User created with name',name)
        res.status(200).send('User has been created')
    } catch (error) {
        console.log(error)
        res.status(500).send('Unable to create user',error)
    }
}

const getAllUsers = async (req, res) => {
   try {
       const users = await User.findAll()
       if (!users) {
           console.log('Unable to find users')
           return res.status(404).send('Users not found')
       }
       res.status(200).json({
           message: 'Fetched all users',
           data:users
       })
       console.log(users)
   } catch (error) {
     res.status(500).send('Unable to fetch users',error)
   }
}

export default {
    addUsers,
    getAllUsers
}