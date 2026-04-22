import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Expense = sequelize.define('expenses',{
    amount: {
        type: DataTypes.INTEGER,
        allowNull:true
    },
    description: {
        type: DataTypes.STRING,
        allowNull:true
    },
    category: {
        type: DataTypes.ENUM('Food', 'Petrol', 'Utilities', 'Entertainment', 'Salary'),
        allowNull:true
    }
})

export default Expense