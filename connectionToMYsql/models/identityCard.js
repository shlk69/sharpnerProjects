import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../utils/db-connection.js";


const IdentityCard = sequelize.define('identitycard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    cardNumber: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull:false
    }
})


export default IdentityCard