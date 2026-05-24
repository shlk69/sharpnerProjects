import sequelize from "../config/db.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { DataTypes } from "sequelize"

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            if (value) {
                this.setDataValue('fullName', value.trim())
            }
        },
        validate: {
            notEmpty: {
                msg: 'Full name cannot be empty'
            }
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('email', value.toLowerCase().trim())
        },
        validate: {
            isEmail: true
        }
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 30],
                msg: 'Password must be minimum 6 characters long'
            }
        }
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        set(value) {
            if (value) {
                const sanitized = value.replace(/[\s()\-.]/g, '');
                this.setDataValue('phoneNumber', sanitized)
            }
        },
        validate: {
            isPhoneFormat(value) {
                if (value) {
                    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
                    if (!phoneRegex.test(value)) {
                        throw new Error('Invalid phone number format.');
                    }
                }
            }
        }
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 12)
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12)
            }
        }
    },
})

User.prototype.toJSON = function () {
    const values = { ...this.get() }
    delete values.password
    return values
}

User.prototype.generateAccessToken = function () {
    return jwt.sign(
        { userId: this.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
}

User.prototype.generateRefreshToken = function () {
    return jwt.sign(
        { userId: this.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
}

User.prototype.isPasswordCorrect = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}

export { User }