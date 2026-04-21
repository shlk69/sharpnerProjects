import { DataTypes, Sequelize } from "sequelize";
import connection from "../config/database.js";
import sequelize from "../config/database.js";

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    name:{
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})


export default User;