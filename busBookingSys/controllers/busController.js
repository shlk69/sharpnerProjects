import Bus from '../models/busesModel.js'
import { Op } from 'sequelize'


const addBuses = async (req, res) => {
    const { busNumber, totalSeats, availableSeats } = req.body
    try {
        const bus = await Bus.create({
            "busNumber": busNumber,
            "totalSeats": totalSeats,
            "availableSeats": availableSeats
        })
        console.log('Bus created successfully', bus)
        res.status(200).json({ message: 'Success', data: bus })
    } catch (error) {
        console.log('Unable to create bus', error)
        res.status(500).json({
            message: 'Issue in creating bus',
            error: error.message
        })    }
}


const getBusByNum = async (req, res) => {
    const { seats } = req.params
    try {
        const availableBus = await Bus.findAll({
            where: {
                availableSeats: {
                    [Op.gt]: Number(seats)
                }
            }
        })
        if (availableBus.length === 0) {
           return res.status(404).send(`No bus found with available seats greater than ${seats}`)
        }
        res.status(200).json({
            message: "Available buses",
            data: availableBus
        })    } catch (error) {
        res.status(500).send('Internal server error',error)
    }
}


export default {
    addBuses,
    getBusByNum
}