'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'createOrder' }), createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('Permissions', permissions, {});

    const insertedPermissions = await queryInterface.sequelize.query(
      `SELECT id FROM "Permissions" WHERE "permission_info"->>'field' IN ('createOrder');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const [userRole] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'user' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!userRole) {
      throw new Error('user role not found');
    }


    const rolePermissions = insertedPermissions.map(permission => ({
      roleId: userRole.id,
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('RolePermissions', rolePermissions, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
