import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../utils/db-connection.js";


const Students = sequelize.define('Students', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false
    }
})


export default Students