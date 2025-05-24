const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    permission_info: { type: DataTypes.JSONB, allowNull: false }  // e.g. { operation: 'Mutation', field: 'createUser' }
});

module.exports = Permission;