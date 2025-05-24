const generateToken = require('../../utils/generateToken');

const { User, Role, Permission, UserRole, RolePermission, Category, Product, Order, OrderItem } = require('../../model');

const checkAuth = require('../../middleware/checkAuth');
const checkPermission = require('../../middleware/checkPermission');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server-express');
const { Op } = require('sequelize');

module.exports = {
  Query: {
    me: async (_, __, { req }) => {
      try {
        await checkAuth(req);
        return req.user;
      } catch (err) {
        throw new AuthenticationError(`Authentication failed: ${err.message}`); 
      }
    },

    users: async (_, __, { req }) => {
      try {
        
        await checkAuth(req);

        const isAllowed = await checkPermission(req.user.id, 'Query', 'users');

        if (!isAllowed) {
            throw new ForbiddenError('Access denied');
        }

        // let userResponse = 

        return await User.findAll({ include: Role });;
      } catch (err) {
        throw new Error(`Failed to fetch users: ${err.message}`); 
      }
    },

    products: async (_, { name, categoryId, minPrice, maxPrice }) => {
      try {
        const where = {};
        if (name){
            where.name = { [Op.iLike]: `%${name}%` };
        }
        if (categoryId){
            where.categoryId = categoryId;
        }
        if (minPrice || maxPrice) {
          where.price = {};
          if (minPrice) where.price[Op.gte] = minPrice;
          if (maxPrice) where.price[Op.lte] = maxPrice;
        }

        let productsResponse = await Product.findAll({ where });

        return productsResponse;
      } catch (err) {
        throw new Error(`Fetch Product details failed: ${err.message}`); 
      }
    },

    product: async (_, { id }) => {
      try {
        const product = await Product.findByPk(id);
        if (!product) throw new UserInputError('Product not found');
        return product;
      } catch (err) {
        throw new Error(`Failed to fetch product: ${err.message}`); 
      }
    },

    categories: async () => {
      try {
        return await Category.findAll();
      } catch (err) {
        throw new Error(`Failed to fetch categories: ${err.message}`); 
      }
    },

    category: async (_, { id }) => {
      try {
        const category = await Category.findByPk(id);
        if (!category) throw new UserInputError('Category not found');
        return category;
      } catch (err) {
        throw new Error(`Failed to fetch category: ${err.message}`); 
      }
    },

    adminOrders: async (_, __, { req }) => {
      try {
        await checkAuth(req);
        const isAdmin = await checkPermission(req.user.id, 'Query', 'adminOrders');
        return isAdmin ? await Order.findAll({ include: ['items'] }) : await Order.findAll({ where: { userId: req.user.id }, include: ['items'] });
      } catch (err) {
        throw new Error(`Failed to fetch orders: ${err.message}`); 
      }
    },

    adminOrderById: async (_, { id }, { req }) => {
      try {
        await checkAuth(req);
        const order = await Order.findByPk(id, { include: ['items'] });
        if (!order) throw new UserInputError('Order not found');
        const isAdmin = await checkPermission(req.user.id, 'Query', 'adminOrderById');
        if (!isAdmin && order.userId !== req.user.id) {
          throw new ForbiddenError('You are not authorized to view this order');
        }
        return order;
      } catch (err) {
        throw new Error(`Failed to fetch order: ${err.message}`); 
      }
    },

    myOrders: async (_, __, { req }) => {
      try {
        await checkAuth(req);
        return await Order.findAll({ where: { userId: req.user.id }, include: ['items'] });
      } catch (err) {
        throw new Error(`Failed to fetch orders: ${err.message}`); 
      }
    },

    myOrderById: async (_, { id }, { req }) => {
      try {
        await checkAuth(req);
        const order = await Order.findOne({
          where: { id, userId: req.user.id },
          include: [{ model: OrderItem, as: 'items' }],
        });
        if (!order) throw new UserInputError('Order not found');
        return order;
      } catch (err) {
        throw new Error(`Failed to fetch order: ${err.message}`); 
      }
    },
  },

  Mutation: {
    register: async (_, { first_name, last_name, email, password, roleId }) => {
      const t = await User.sequelize.transaction();
      try {
        const user = await User.create({ first_name, last_name, email, password }, { transaction: t });
        await UserRole.create({ userId: user.id, roleId }, { transaction: t });
        await t.commit();
        return user;
      } catch (error) {
        await t.rollback();
        throw new Error(`User creation failed: ${error.message}`); 
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new AuthenticationError('Invalid credentials');
        }
        const token = generateToken(user);
        return { token, user };
      } catch (err) {
        throw new Error(`Login failed: ${err.message}`); 
      }
    },

    deleteUser: async (_, { id }, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'deleteUser');
        if (!allowed) throw new ForbiddenError('Access Denied');
        const user = await User.findByPk(id);
        if (!user) throw new UserInputError('User not found');
        await user.destroy();
        return true;
      } catch (err) {
        throw new Error(`Failed to delete user: ${err.message}`); 
      }
    },

    createRole: async (_, { name }, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'createRole');
        if (!allowed) throw new ForbiddenError('Access Denied');
        return await Role.create({ name });
      } catch (err) {
        throw new Error(`Failed to create role: ${err.message}`); 
      }
    },

    createProduct: async (_, { name, description, price, inventory, categoryId }, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'createProduct');
        if (!allowed) throw new ForbiddenError('You are not allowed to perform this action');
        const category = await Category.findByPk(categoryId);
        if (!category) throw new UserInputError('Category not found');
        return await Product.create({ name, description, price, inventory, categoryId });
      } catch (err) {
        throw new Error(`Failed to create product: ${err.message}`); 
      }
    },


    updateProduct: async (_, args, { req }) => {
      try {
        await checkAuth(req);

        const allowed = await checkPermission(req.user.id, 'Mutation', 'updateProduct');
        if (!allowed) throw new ForbiddenError('You are not allowed to perform this action');

        const { id, ...fieldsDetails } = args;

        if (Object.keys(fieldsDetails).length === 0) {
          throw new UserInputError('No update fields provided');
        }

        const product = await Product.findByPk(id);
        if (!product) throw new UserInputError('Product not found');

        await product.update(fieldsDetails);
        return product;
      } catch (err) {
        throw new Error(`Failed to update product: ${err.message}`);
      }
    },

    deleteProduct: async (_, { id }, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'updateProduct');
        if (!allowed) throw new ForbiddenError('You are not allowed to perform this action');
        const product = await Product.findByPk(id);
        if (!product) throw new UserInputError('Product not found');
        await product.destroy();
        return true;
      } catch (err) {
        throw new Error(`Failed to delete product: ${err.message}`); 
      }
    },

    createCategory: async (_, { name, description }, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'createCategory');
        if (!allowed) throw new ForbiddenError('You are not allowed to perform this action');
        return await Category.create({ name, description });
      } catch (err) {
        throw new Error(`Failed to create category: ${err.message}`); 
      }
    },

    updateCategory: async (_, args, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'updateCategory');
        if (!allowed) throw new ForbiddenError('You are not allowed to perform this action');
        const { id, ...fieldsDetails } = args;
        const category = await Category.findByPk(id);
        if (!category) throw new UserInputError('Category not found');
        await category.update(fieldsDetails);
        return category;
      } catch (err) {
        throw new Error(`Failed to update category: ${err.message}`); 
      }
    },

    createOrder: async (_, { items }, { req }) => {
      await checkAuth(req);
      const t = await Order.sequelize.transaction();
      try {
        let totalAmount = 0;
        const orderItems = await Promise.all(
          items.map(async (item) => {
            const product = await Product.findByPk(item.productId);
            if (!product) throw new UserInputError('Product not found');
            totalAmount += product.price * item.quantity;
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.price,
            };
          })
        );

        const order = await Order.create({ userId: req.user.id, status: 'PENDING', totalAmount }, { transaction: t });

        for (const item of orderItems) {
          await OrderItem.create({ orderId: order.id, ...item }, { transaction: t });
        }

        await t.commit();
        return await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
      } catch (err) {
        await t.rollback();
        throw new Error(`Failed to create order: ${err.message}`); 
      }
    },

    updateOrderStatus: async (_, { orderId, status }, { req }) => {
      try {
        await checkAuth(req);
        const allowed = await checkPermission(req.user.id, 'Mutation', 'updateOrderStatus');
        if (!allowed) throw new ForbiddenError('Access Denied');
        const order = await Order.findByPk(orderId);
        if (!order) throw new UserInputError('Order not found');
        order.status = status;
        await order.save();
        return order;
      } catch (err) {
        throw new Error(`Failed to update the status: ${err.message}`); 
      }
    },
  },

  OrderItem: {
    product: async (orderItem) => {
      try {
        const product = await Product.findByPk(orderItem.productId);
        if (!product) throw new Error('Product not found');
        return product;
      } catch (err) {
        throw new Error(`Failed to fetch product from order item: ${err.message}`); 
      }
    },
  },
};
