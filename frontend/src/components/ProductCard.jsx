import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_ITEM_TO_CART, GET_CART_QUERY, SAVE_PRODUCT, UNSAVE_PRODUCT, GET_USER_SAVED_PRODUCTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

const ProductCard = ({ product, onRemove }) => {
  const { user } = useAuth();
  const { isSaved, toggleFavorite } = useFavorites();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const saved = isSaved(product.productId);

  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART, {
    refetchQueries: [{ query: GET_CART_QUERY, variables: { userId: user?.userId } }],
    onCompleted: () => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    },
    onError: (error) => {
      console.error('Error adding item to cart:', error);
      setIsAdding(false);
    }
  });

  const [saveProduct] = useMutation(SAVE_PRODUCT, {
    refetchQueries: [{ query: GET_USER_SAVED_PRODUCTS, variables: { userId: user?.userId } }],
    onCompleted: () => {
      toggleFavorite(product.productId);
    },
    onError: (error) => {
      console.error('Error saving product:', error);
    }
  });

  const [unsaveProduct] = useMutation(UNSAVE_PRODUCT, {
    refetchQueries: [{ query: GET_USER_SAVED_PRODUCTS, variables: { userId: user?.userId } }],
    onCompleted: () => {
      toggleFavorite(product.productId);
      if (onRemove) {
        onRemove(product.productId);
      }
    },
    onError: (error) => {
      console.error('Error unsaving product:', error);
    }
  });

  const formatPrice = (price) => {
    // Преобразуем строку в число, если это необходимо
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice) + ' Br'
  }

  const isInStock = product.inventory > 0

  const handleAddToCart = async () => {
    if (!user?.userId) {
      alert('Необходимо войти в систему для добавления товаров в корзину');
      return;
    }

    setIsAdding(true);
    try {
      await addItemToCart({
        variables: {
          userId: user.userId,
          productId: product.productId,
          quantity: 1
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user?.userId) {
      alert('Необходимо войти в систему для сохранения товаров');
      return;
    }

    try {
      if (saved) {
        // Если товар уже сохранен - удаляем
        await unsaveProduct({
          variables: {
            productId: product.productId,
            userId: user.userId
          }
        });
      } else {
        // Если товар не сохранен - сохраняем
        await saveProduct({
          variables: {
            productId: product.productId,
            userId: user.userId
          }
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }

  return (
    <div className="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#B39CD0]">
      <div className="relative">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center h-56 sm:h-60 lg:h-64 rounded-t-lg">
          <svg className="w-20 h-20 sm:w-24 sm:h-24 text-[#B39CD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        {/* Кнопка избранного */}
        <button
          onClick={handleToggleSave}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 z-10"
        >
          <svg 
            className={`w-6 h-6 transition-colors ${saved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>

        {!isInStock && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Нет в наличии
          </div>
        )}
        {isInStock && product.inventory < 5 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Скоро закончится
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 rounded-b-lg">
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-[#B39CD0] text-xs px-2 py-1 rounded-full">
            {product.productCategory?.categoryName || 'Без категории'}
          </span>
        </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.productName}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.productDescription || `${product.productBrand} ${product.productModel}`}
          </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-[#B39CD0]">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-gray-500">
              {isInStock ? `В наличии: ${product.inventory} шт.` : 'Товар закончился'}
            </div>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            isInStock && !isAdding
              ? 'bg-[#B39CD0] text-white hover:bg-[#9575CD] hover:shadow-lg hover:-translate-y-0.5'
              : isAdding
              ? 'bg-[#B39CD0] bg-opacity-70 text-white cursor-wait'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isInStock || isAdding}
        >
          {isAdding ? 'Добавляем...' : showSuccess ? 'Добавлено!' : isInStock ? 'В корзину' : 'Недоступно'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard

