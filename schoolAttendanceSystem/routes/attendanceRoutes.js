import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/fetch', attendanceController.getAttendanceByDate);
router.post('/save', attendanceController.saveAttendance);

export default router;