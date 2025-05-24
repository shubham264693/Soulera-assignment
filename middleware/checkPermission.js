const { UserRole, RolePermission, Permission } = require('../model');
const { Op } = require('sequelize');

const checkPermission = async (userId, operation, field) => {
  const roles = await UserRole.findAll({ where: { userId } });
  const roleIds = roles.map(r => r.roleId);

  const rolePermissions = await RolePermission.findAll({
    where: { roleId: { [Op.in]: roleIds } }
  });

  const permissionIds = rolePermissions.map(p => p.permissionId);

  const permissions = await Permission.findAll({
    where: { id: { [Op.in]: permissionIds } }
  });

  return permissions.some(({ permission_info }) =>
    permission_info.operation === operation && permission_info.field === field
  );
};

module.exports = checkPermission;