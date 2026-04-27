import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";


const PasswordReset =  sequelize.define('passwordReset', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    }
}, {
    timestamps:true
})

User.hasMany(PasswordReset, {
    foreignKey: 'userId',
    onDelete:'CASCADE'
})
PasswordReset.belongsTo(User, {
    foreignKey:'userId'
})

export default PasswordReset