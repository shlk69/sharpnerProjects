import Attendance from '../model/attendanceModel.js';

 const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const records = await Attendance.findAll({ where: { date } });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const saveAttendance = async (req, res) => {
    try {
        const { date, records } = req.body;

        await Attendance.destroy({ where: { date } });

        const dataToSave = records.map(r => ({ ...r, date }));
        const result = await Attendance.bulkCreate(dataToSave);

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export default {
    getAttendanceByDate,
    saveAttendance
}