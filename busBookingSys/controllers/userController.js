import {User,Bus,Booking} from "../models/index.js";

const createUser = async (req, res) => {
    const { name, email } = req.body
    try {
        const user = await User.create({
            "name": name,
            "email": email
        })
        console.log('User created with name',name)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send('Unable to create user',error)
    }
}

const getUserBookings = async (req, res) => {
   try {
       const bookings = await Booking.findAll({
           where: {
               userId:req.params.id
           },
           attributes: ['id', 'seatNumber'],
           include:[{model:Bus,attributes:['busNumber']}]
       })
       res.json(bookings)
   } catch (err) {
     res.status(500).json({error:err.message})
   }
}

export {
    createUser,
    getUserBookings
}