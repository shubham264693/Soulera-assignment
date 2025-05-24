'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      { id: uuidv4(), name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'user', createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert('Roles', roles, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', { name: ['admin', 'user'] });
  },
};
