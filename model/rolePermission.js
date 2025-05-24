const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RolePermission = sequelize.define('RolePermission', {
  roleId: DataTypes.UUID,
  permissionId: DataTypes.UUID
});

module.exports = RolePermission;