import sequelize from "../utils/db.js";
import { Sequelize, DataTypes } from "sequelize";


const Appointment = sequelize.define('bookingappointment',{
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey:true
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    }
})


export default Appointment