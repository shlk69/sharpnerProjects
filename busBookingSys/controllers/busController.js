import { Booking, Bus, User } from '../models/index.js';  // ← use index

const createBus = async (req, res) => {
    const { busNumber, totalSeats, availableSeats } = req.body;
    try {
        const bus = await Bus.create({ busNumber, totalSeats, availableSeats });
        res.status(201).json(bus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBusBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { busId: req.params.id },
            attributes: ['id', 'seatNumber'],
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { createBus, getBusBookings };