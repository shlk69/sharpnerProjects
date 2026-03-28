
import { Booking } from '../models/index.js';  // ← use index

const createBooking = async (req, res) => {
    try {
        const { userId, busId, seatNumber } = req.body;
        const booking = await Booking.create({ userId, busId, seatNumber });
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { createBooking };