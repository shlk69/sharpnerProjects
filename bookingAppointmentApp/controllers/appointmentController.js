import Appointment from "../models/appointmentModel.js";

const addUser = async (req, res) => {
    const { name, email, contactNumber } = req.body;
    try {
        const userCreated = await Appointment.create({ name, email, contactNumber });
        res.status(200).json({ message: 'Success', data: userCreated });
    } catch (error) {
        console.error("addUser error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await Appointment.findAll();
        // Always return 200 with data array — even if empty
        res.status(200).json({ message: 'Success', data: users });
    } catch (error) {
        console.error("getAllUsers error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Appointment.update(req.body, { where: { id } });
        if (result[0] === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated" });
    } catch (error) {
        console.error("updateUser error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Appointment.destroy({ where: { id } });
        res.status(200).json({ message: 'Deleted', data: deleted });
    } catch (error) {
        console.error("removeUser error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export default { addUser, getAllUsers, updateUser, removeUser };