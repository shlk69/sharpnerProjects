import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './user.model.js'

const Expense = sequelize.define(
    'expense',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        category: {
            type: DataTypes.ENUM(
                'Food',
                'Petrol',
                'Utilities',
                'Entertainment',
                'Salary'
            ),
            allowNull: false
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        }
    },
    {
        timestamps: true
    }
)



User.hasMany(Expense, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

Expense.belongsTo(User, {
    foreignKey: 'userId'
})

export default Expense