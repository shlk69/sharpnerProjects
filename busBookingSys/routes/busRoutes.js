import express from 'express';
import { createBus, getBusBookings } from '../controllers/busController.js'
const router = express.Router();


router.post('/', createBus);
router.get('/:id/bookings', getBusBookings);

export default router;