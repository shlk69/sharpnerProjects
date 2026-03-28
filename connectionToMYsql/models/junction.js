import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../utils/db-connection.js";


const StudentCourse = sequelize.define('studentCourses', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    }
})

export default StudentCourse