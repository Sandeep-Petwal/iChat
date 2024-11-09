//import { DataTypes } from "sequelize";
const { DataTypes } = require("sequelize");
const sequelize = require("../database/database")

const Users = sequelize.define("users", {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});


module.exports = Users