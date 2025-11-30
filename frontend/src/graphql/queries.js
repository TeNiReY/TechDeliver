import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      categories {
        categoryId
        categoryName
        categoryDescription
        products {
          productId
          productName
          price
          inventory
          productBrand
          productModel
          productDescription
        }
      }
      message
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($categoryId: ID!) {
    getCategoryById(categoryId: $categoryId) {
      categoryDto {
        categoryId
        categoryName
        categoryDescription
        products {
          productId
          productName
          price
          inventory
          productBrand
          productModel
          productDescription
        }
      }
      message
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!) {
    getProductsByCategory(categoryId: $categoryId) {
      productId
      productName
      price
      inventory
      productBrand
      productModel
      productWeight
      productWidth
      productLength
      productHeight
      productDescription
      productCategory {
        categoryId
        categoryName
        categoryDescription
      }
      images {
        id
        fileName
        downloadUrl
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($productId: ID!) {
    getProductById(productId: $productId) {
      productId
      productName
      price
      inventory
      productBrand
      productModel
      productWeight
      productWidth
      productLength
      productHeight
      productDescription
      productCategory {
        categoryId
        categoryName
        categoryDescription
      }
      images {
        id
        fileName
        downloadUrl
      }
    }
  }
`;

// Auth mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      userId
      message
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterUserAccount($input: RegisterInput!) {
    registerUserAccount(input: $input) {
      result
      message
    }
  }
`;

// User queries
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    getUserProfileInfo(userId: $userId) {
      userId
      email
      username
      roles
      savedDeliveryAddress
    }
  }
`;

// User mutations
export const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($userId: ID!, $newUsername: String!) {
    updateUsername(userId: $userId, newUsername: $newUsername) {
      userId
      username
      email
      roles
      savedDeliveryAddress
    }
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdateUserPassword($userId: ID!, $oldPass: String!, $newPass: String!) {
    updateUserPassword(userId: $userId, oldPass: $oldPass, newPass: $newPass) {
      userId
      username
      email
      roles
      savedDeliveryAddress
    }
  }
`;

export const SET_DELIVERY_ADDRESS_MUTATION = gql`
  mutation SetDeliveryAddress($userId: ID!, $address: String!) {
    setDeliveryAddress(userId: $userId, address: $address)
  }
`;

// Cart queries
export const GET_CART_QUERY = gql`
  query GetCart($userId: ID!) {
    getCart(userId: $userId) {
      cartId
      userId
      totalPrice
      cartItems {
        cartItemId
        quantity
        unitPrice
        totalPrice
        product {
          productId
          productName
          price
          productBrand
          productModel
          images {
            id
            fileName
            downloadUrl
          }
        }
      }
    }
  }
`;

// Cart mutations
export const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($userId: ID!, $productId: ID!, $quantity: Int!) {
    addItemToCart(userId: $userId, productId: $productId, quantity: $quantity) {
      result
      message
    }
  }
`;

export const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($userId: ID!, $productId: ID!) {
    removeItemFromCart(userId: $userId, productId: $productId) {
      result
      message
    }
  }
`;

export const UPDATE_ITEM_QUANTITY = gql`
  mutation UpdateItemQuantity($userId: ID!, $productId: ID!, $newQuantity: Int!) {
    updateItemQuantity(userId: $userId, productId: $productId, newQuantity: $newQuantity) {
      result
      message
    }
  }
`;

// Order queries
export const GET_USER_ORDERS = gql`
  query GetUserOrders($userId: ID!) {
    getUserOrders(userId: $userId) {
      id
      userId
      orderDate
      deliveryAddress
      distanceInKM
      orderTotalPrice
      orderItemsTotalPrice
      deliveryTotalPrice
      installationPrice
      deliveryUrgency
      status
      orderItems {
        productId
        productName
        productBrand
        quantity
        price
      }
    }
  }
`;

// Order mutations
export const CALCULATE_ORDER_PREVIEW = gql`
  mutation CalculateOrderPreview($input: PlaceOrderInput!) {
    calculateOrderPreview(input: $input) {
      userId
      orderDate
      deliveryAddress
      orderTotalPrice
      orderItemsTotalPrice
      deliveryTotalPrice
      installationPrice
      orderItems {
        cartItemId
        quantity
        unitPrice
        totalPrice
        product {
          productId
          productName
          productBrand
          productModel
          images {
            id
            fileName
            downloadUrl
          }
        }
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      id
      userId
      orderDate
      deliveryAddress
      distanceInKM
      orderTotalPrice
      orderItemsTotalPrice
      deliveryTotalPrice
      installationPrice
      deliveryUrgency
      status
      orderItems {
        productId
        productName
        productBrand
        quantity
        price
      }
    }
  }
`;

// Favorites queries and mutations
export const GET_USER_SAVED_PRODUCTS = gql`
  query GetUserSavedProducts($userId: ID!) {
    getUserSavedProducts(userId: $userId) {
      productId
      productName
      price
      inventory
      productBrand
      productModel
      productDescription
      productCategory {
        categoryId
        categoryName
        categoryDescription
      }
    }
  }
`;

export const SAVE_PRODUCT = gql`
  mutation SaveProduct($productId: ID!, $userId: ID!) {
    saveProduct(productId: $productId, userId: $userId) {
      productId
      productName
      price
    }
  }
`;

export const GET_SAVED_PRODUCT_IDS = gql`
  query GetSavedProductIds($userId: ID!) {
    getSavedProductsIds(userId: $userId)
  }
`;

export const UNSAVE_PRODUCT = gql`
  mutation UnsaveProduct($productId: ID!, $userId: ID!) {
    unsaveProduct(productId: $productId, userId: $userId)
  }
`;

// Admin - Products
export const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      productDto {
        productId
        productName
        price
        inventory
      }
      message
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($productId: ID!, $input: UpdateProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      productDto {
        productId
        productName
        price
        inventory
        productDescription
      }
      message
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
  }
`;

// Admin - Categories
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      categoryDto {
        categoryId
        categoryName
        categoryDescription
      }
      message
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $input: UpdateCategoryInput!) {
    updateCategory(categoryId: $categoryId, input: $input) {
      categoryDto {
        categoryId
        categoryName
        categoryDescription
        installationComplexityCoefficient
      }
      message
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: ID!) {
    deleteCategory(categoryId: $categoryId)
  }
`;

// Admin - Users
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      userId
      email
      username
      roles
      savedDeliveryAddress
    }
  }
`;

// Admin - Orders
export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    getAllOrders {
      id
      userId
      orderDate
      deliveryAddress
      distanceInKM
      orderTotalPrice
      orderItemsTotalPrice
      deliveryTotalPrice
      installationPrice
      deliveryUrgency
      status
      orderItems {
        productId
        productName
        productBrand
        quantity
        price
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
    }
  }
`;

// Admin - User Management
export const BLOCK_USER = gql`
  mutation BlockUser($userId: ID!) {
    blockUser(userId: $userId) {
      userId
      username
      email
      roles
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($userId: ID!) {
    unblockUser(userId: $userId) {
      userId
      username
      email
      roles
    }
  }
`;