import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.model.js";

const Expense = sequelize.define('expenses', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM('Food', 'Petrol', 'Utilities', 'Entertainment', 'Salary'),
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
})

// Associations
User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' })
Expense.belongsTo(User, { foreignKey: 'userId' })

export default Expense