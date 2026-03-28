import sequelize from "../utils/db.js";
import { DataTypes } from "sequelize";

const Appointment = sequelize.define('bookingappointments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

export default Appointment;