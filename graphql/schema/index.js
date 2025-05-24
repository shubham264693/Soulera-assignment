const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    email: String!
    first_name: String!
    last_name: String!
  }

  type Role {
    id: ID!
    name: String!
    permissions: [Permission!]
  }

  type Permission {
    id: ID!
    permission_info: JSON
  }

  type Category {
    id : ID!
    name : String!,
    description : String
  }

  type Product {
    id : ID!
    name : String!
    description: String
    price: Float
    inventory: Int
    categoryId: ID
  }

  type Order {
    id: ID!
    userId: ID!
    status: String!
    totalAmount: Float!
    createdAt: String!
    updatedAt: String!
    items: [OrderItem!]
  }

  type OrderItem {
    id: ID!
    orderId: ID!
    productId: ID!
    quantity: Int!
    unitPrice: Float!
    product: Product!
  }


  scalar JSON

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
    roles: [Role]
    permissions: [Permission]

    products(name: String, categoryId: ID, minPrice: Float, maxPrice: Float): [Product]    
    product(id: ID!): Product

    categories: [Category]
    category(id: ID!): Category

    adminOrders: [Order]
    adminOrderById(id: ID!): Order

    myOrders: [Order]
    myOrderById(id: ID!): Order

  }

  type Mutation {
    register(first_name: String!, last_name: String!, email: String!, password: String!, roleId: String!): User
    createProduct(name: String!, description: String!, price: Float!, inventory: Int!, categoryId: ID!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float, inventory: Int): Product
    deleteProduct(id: ID!): Boolean
    createCategory(name: String!, description: String! ): Category
    updateCategory(id : ID!, name: String, description: String ): Category
    login(email: String!, password: String!): AuthPayload
    createRole(name: String!): Role
    createPermission(permission_info: JSON!): Permission
    assignPermissionToRole(roleId: Int!, permissionId: Int!): Role
    assignRoleToUser(roleId: Int!, userId: Int!): User
    deleteUser(id: ID!): Boolean
    createOrder( items: [OrderItemInput!]! ): Order
    updateOrderStatus( orderId: ID!, status: String! ): Order
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    unitPrice: Float!
  }
`;