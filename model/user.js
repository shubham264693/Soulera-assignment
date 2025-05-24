const { Sequelize,DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db')

const User = db.define('User',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    first_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    last_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    isActive : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
})

User.beforeCreate(async (user)=>{
    user.password = await bcrypt.hash(user.password,10);
})


module.exports = User;