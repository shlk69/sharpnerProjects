import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../utils/db-connection.js";

const department = sequelize.define('department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name: {
        type:DataTypes.STRING
    }
})

export default department