import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './user.model.js'

const Order = sequelize.define(
    'order',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        status: {
            type: DataTypes.ENUM(
                'PENDING',
                'SUCCESSFUL',
                'FAILED'
            ),
            allowNull: false,
            defaultValue: 'PENDING'
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



User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

Order.belongsTo(User, {
    foreignKey: 'userId'
})

export default Order