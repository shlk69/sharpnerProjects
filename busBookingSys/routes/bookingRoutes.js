import  express from 'express';
const router = express.Router();
import {createBooking}  from '../controllers/bookingController.js';

router.post('/', createBooking);

export default  router;