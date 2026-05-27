import sequelize from '../config/db.js'
import { DataTypes } from 'sequelize'
import { User } from './user.model.js'

export const Chat = sequelize.define('chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull:false
    }
})

User.hasMany(Chat, { foreignKey: 'userId' })
Chat.belongsTo(User, { foreignKey: 'userId' })