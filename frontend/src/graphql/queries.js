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
