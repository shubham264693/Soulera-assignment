'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'createProduct' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'updateProduct' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'deleteProduct' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'createCategory' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'updateCategory' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'updateOrderStatus' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'createRole' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'createPermission' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'assignPermissionToRole' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'assignRoleToUser' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Mutation', field: 'deleteUser' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Query', field: 'adminOrders' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Query', field: 'adminOrderById' }), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), permission_info: JSON.stringify({ operation: 'Query', field: 'users' }), createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('Permissions', permissions, {});

    const insertedPermissions = await queryInterface.sequelize.query(
      `SELECT id FROM "Permissions" WHERE "permission_info"->>'field' IN ('createProduct', 'updateProduct', 'deleteProduct', 'createCategory', 'updateCategory', 'createRole', 'createPermission', 'assignPermissionToRole', 'assignRoleToUser', 'deleteUser', 'adminOrders', 'adminOrderById', 'updateOrderStatus', 'users');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'admin' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminRole) {
      throw new Error('Admin role not found');
    }


    const rolePermissions = insertedPermissions.map(permission => ({
      roleId: adminRole.id,
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
