import express  from 'express';
import {createUser,getUserBookings} from '../controllers/userController.js'
const router = express.Router();



router.post('/', createUser);
router.get('/:id/bookings', getUserBookings);

export default  router;