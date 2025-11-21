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

// User mutations
export const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($userId: ID!, $newUsername: String!) {
    updateUsername(userId: $userId, newUsername: $newUsername) {
      userId
      username
      email
    }
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdateUserPassword($userId: ID!, $oldPass: String!, $newPass: String!) {
    updateUserPassword(userId: $userId, oldPass: $oldPass, newPass: $newPass) {
      userId
      username
      email
    }
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
      totalAmount
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
export const PLACE_ORDER = gql`
  mutation PlaceOrder($userId: ID!) {
    placeOrder(userId: $userId) {
      id
      userId
      orderDate
      totalAmount
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