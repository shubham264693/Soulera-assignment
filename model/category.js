const { Sequelize,DataTypes } = require('sequelize');
const db = require('../config/db')

const Category = db.define('Category',{
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
    isActive : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
})

module.exports = Category;