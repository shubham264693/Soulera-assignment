Step: 1) npm i

Step: 2) npm start

Step 3) npm run db:seed
	

=================================================================================================================
    Query and Mutation
=================================================================================================================

=================================================================================================================
    User profile management (authenticated)
=================================================================================================================

query {
  me {
    email,
    first_name
  }
}


=================================================================================================================
- Return all users (admin only)
=================================================================================================================

query {
  users {
     email,
     first_name,
     last_name
  }
}

=================================================================================================================
- Return products with filtering options
=================================================================================================================

query {
  products(name: "apple") {
    id
    name
    price
    categoryId
  }
}

query {
  products(minPrice: 50000.00, maxPrice: 75000.00) {
    id
    name
    price
    categoryId
  }
}

=================================================================================================================
- Return a product by ID
=================================================================================================================

query {
  products {
    id
    name
    price
    categoryId
  }
}



=================================================================================================================
- Return all categories
=================================================================================================================


query {
  categories {
    id,name
  }
}

=================================================================================================================
- Return a category by ID
=================================================================================================================

query($categoryId: ID!) {
  category(id: $categoryId) {
    id,
    name
  }
}


=================================================================================================================
- Return orders (for admins) 
=================================================================================================================

query {
  adminOrders {
    id,totalAmount,userId,createdAt,updatedAt
  }
}

=================================================================================================================
- user's orders (for customers)
=================================================================================================================


query {
  myOrders {
    id,totalAmount,userId,createdAt,updatedAt
  }
}

=================================================================================================================
- Return order details ( by Id )
=================================================================================================================


query($myOrderByIdId: ID!) {
  myOrderById(id: $myOrderByIdId) {
    id,
    totalAmount,
    userId,
    createdAt,
    updatedAt
  }
}



query GetOrderDetailsWithProducts($id: ID!) {
  myOrderById(id: $id) {
    id
    status
    totalAmount
    createdAt
    updatedAt
    items {
      id
      quantity
      unitPrice
      product {
        id
        name
        description
        price
        inventory
        categoryId
      }
    }
  }
}





=================================================================================================================
        Mutations
=================================================================================================================


=================================================================================================================
- Create a new user account
=================================================================================================================


mutation($firstName: String!, $lastName: String!, $email: String!, $password: String!, $roleId: String!) {
  register(first_name: $firstName, last_name: $lastName, email: $email, password: $password, roleId: $roleId) {
    email
  }
}


Variables


{
  "firstName": "Test",
  "lastName": "User",
  "email": "test.user@gmail.com",
  "password": "test@123",
  "roleId": "f09b68ab-ab4d-4930-b22e-3c2bcb7cc1c7"
}


=================================================================================================================
- Authenticate a user and return a token
=================================================================================================================

mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token,
    user {
      email
    }
  }
}


Variables


{
  "email": "test.user@gmail.com",
  "password": "test@123"
}


=================================================================================================================
- Add a new product (admin)
=================================================================================================================

mutation($name: String!, $description: String!, $price: Float!, $inventory: Int!, $categoryId: ID!) {
  createProduct(name: $name, description: $description, price: $price, inventory: $inventory, categoryId: $categoryId) {
    id,
    name
  }
}


Variables


{
  "name": "Moto Fusion 50",
  "price": 20000.99,
  "inventory": 10,
  "categoryId": "801ce482-3aa5-4e00-a43e-90a6aca33f24",
  "description": "Motorola fusion 50 newly launched mobile with best selling price"
}





=================================================================================================================
- Update a product (admin)
=================================================================================================================


mutation($updateProductId: ID!, $inventory: Int) {
  updateProduct(id: $updateProductId,inventory: $inventory) {
    id,
    inventory
  }
}

Variables
{
  "updateProductId": "78ed3a49-cf4c-4649-b2e3-ad4eafdc341e",
  "inventory" : 45
}






=================================================================================================================
- Delete a product (admin)
=================================================================================================================


mutation($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId)
}


Variables
{
  "deleteProductId": "78ed3a49-cf4c-4649-b2e3-ad4eafdc341e"
}

=================================================================================================================
- Add a new category (admin)
=================================================================================================================


mutation($name: String!, $description: String!) {
  createCategory(name: $name, description: $description) {
    id,
    name
  }
}

Variables
{
  "name": "home appliances",
  "description": "All home appliances products will belong to this category"
}

=================================================================================================================
- Update a category (admin)
=================================================================================================================

mutation($updateCategoryId: ID!, $description : String) {
  updateCategory(id: $updateCategoryId, description: $description) {
    id,
    description
  }
}


Variables


{
  "updateCategoryId": "83b0fa87-3d2d-42f0-abfb-85639199b05c",
  "description" : "A home appliance, also referred to as a domestic appliance, an electric appliance or a household appliance, is a machine which assists in household functions"
}


- Create New Order


mutation($items: [OrderItemInput!]!) {
  createOrder(items: $items) {
    items {
      productId,
      quantity,
      unitPrice
    }
  }
}


Variables

{
  "items": [
    {
      "productId": "92a68082-2e64-4790-9380-d6165e0c429b",
      "quantity": 2,
      "unitPrice": 54000.99
    }
  ]
}




- Change order status (admin)


mutation($orderId: ID!, $status: String!) {
  updateOrderStatus(orderId: $orderId, status: $status) {
    id
  }
}


Variables
{
  "orderId": "9b041eda-a1f2-4a11-8dd2-35af1ff30ce4",
  "status": "PROCESSING"
}
