import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100]
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        isPremiumUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        totalExpenses: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        timestamps: true
    }
)

export default User