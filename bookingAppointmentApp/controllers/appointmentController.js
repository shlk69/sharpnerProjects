import Appointment from "../models/appointmentModel.js";

const addUser = async (req, res) => {
    const { name, email, contactNumber } = req.body
    try {
        const userCreated = await Appointment.create({
            "name": name,
            "email": email,
            "contactNumber": contactNumber
        })
        console.log(`User created with nane ${name}`)
        res.status(200).json({
            message: 'Success',
            data: userCreated
        })
    } catch (error) {
        res.status(500).json(error)
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await Appointment.findAll()
        if (users.length === 0) {
            return res.status(404).json({message:'No user available'})
        }
        res.status(200).json({message:'Success',data:users})
    } catch (error) {
        res.status(500).json(error)
    }
}


const updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const result = await Appointment.update(req.body, {
            where:{id}
        })
    
        if (result[0] === 0) {
            return res.status(404).json({message:"User not found"})
        }
        res.json({message:"User updated"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


const removeUser = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Appointment.destroy({
            where: {
            id:id
            }
        })
        res.status(200).json({message:'Deleted',data:deleted})
    } catch (error) {
        res.status(500).json(error)
    }
};


export default {
    addUser,
    getAllUsers,
    updateUser,
    removeUser
}