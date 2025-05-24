const { Sequelize,DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db')

const Product = db.define('Product',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false
    },
    price : {
        type : DataTypes.FLOAT,
        allowNull : false,
        unique : true
    },
    inventory : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    categoryId :{
        type : DataTypes.UUID,
        allowNull : false
    },
    isActive : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
})

module.exports = Product;