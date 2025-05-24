const sequelize = require('../config/db');
const User = require('./user');
const Role = require('./role');
const Permission = require('./permissions');
const RolePermission = require('./rolePermission');
const UserRole = require('./userRole');
const Category = require('./category');
const Product = require('./product');
const Order = require('./order');
const OrderItem = require('./OrderItem')


Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId'
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId'
});

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId'
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId'
});


Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });


User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });


Order.hasMany(OrderItem, { foreignKey: 'orderId', as : 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });


Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Category,
  Product,
  Order,
  OrderItem
};
