const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db')

const OrderItem = db.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    unitPrice: {
        type: DataTypes.FLOAT,
    }
});

module.exports = OrderItem;