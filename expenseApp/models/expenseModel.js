import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const Expense = sequelize.define('expenses', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    expenseName: {
        type: DataTypes.STRING,
        allowNull:false
    },
    expenseAmount: {
        type: DataTypes.INTEGER,
        allowNull:false
    }
})

export default Expense