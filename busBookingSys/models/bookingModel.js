import { DataTypes } from "sequelize";
import sequelize from "../utils/db-connection.js";

const Booking = sequelize.define('bookings',{
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    userId: {
        type: DataTypes.INTEGER,
        references:{model:'Users',key:'id'}
    },
    busId: {
        type: DataTypes.INTEGER,
        references:{model:'Buses',key:'id'}
    }
})


export  {Booking}