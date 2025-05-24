const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db')

const Order = db.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING',
    },
    totalAmount: { 
        type : DataTypes.FLOAT 
    }
});

module.exports = Order;