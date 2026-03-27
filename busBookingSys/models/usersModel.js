import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../utils/db-connection.js";

const User = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    name: {
        
        type: DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull:false
    }
})

export default User