import { DataTypes } from "sequelize";
import sequelize from '../utils/db-connection.js'


const Course = sequelize.define('courses', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Course