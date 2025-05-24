const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserRole = sequelize.define('UserRole', {
  userId: DataTypes.UUID,
  roleId: DataTypes.UUID
});

module.exports = UserRole;