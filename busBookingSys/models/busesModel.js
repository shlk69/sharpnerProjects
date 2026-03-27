import sequelize from "../utils/db-connection.js";
import { Sequelize,DataTypes } from "sequelize";

const Bus = sequelize.define('Buses', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    busNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },    
});


export default Bus