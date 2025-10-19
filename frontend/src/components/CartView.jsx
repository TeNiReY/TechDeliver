import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_CART_QUERY, REMOVE_ITEM_FROM_CART, UPDATE_ITEM_QUANTITY, PLACE_ORDER } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const CartView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  const { data, loading, error, refetch } = useQuery(GET_CART_QUERY, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    onError: (error) => {
      console.error('Cart query error:', error);
    }
  });

  const [removeItemFromCart] = useMutation(REMOVE_ITEM_FROM_CART, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error removing item from cart:', error);
    }
  });

  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error updating item quantity:', error);
    }
  });

  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted: () => {
      setIsPlacingOrder(false);
      setShowOrderSuccess(true);
      refetch();
      setTimeout(() => setShowOrderSuccess(false), 3000);
    },
    onError: (error) => {
      console.error('Error placing order:', error);
      setIsPlacingOrder(false);
    }
  });

  const handleRemoveItem = async (productId) => {
    try {
      await removeItemFromCart({
        variables: {
          userId: user.userId,
          productId: productId
        }
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    try {
      await updateItemQuantity({
        variables: {
          userId: user.userId,
          productId: productId,
          newQuantity: newQuantity
        }
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user?.userId) {
      alert('Необходимо войти в систему для оформления заказа');
      return;
    }

    setIsPlacingOrder(true);
    try {
      await placeOrder({
        variables: {
          userId: user.userId
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  console.log('CartView - user:', user);
  console.log('CartView - userId:', user?.userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Загрузка корзины...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Ошибка загрузки корзины: {error.message}
      </div>
    );
  }

  const cart = data?.getCart;

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
        <p className="text-gray-500">Добавьте товары в корзину, чтобы увидеть их здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Корзина</h2>
        <div className="text-lg font-medium">
          Общая сумма: <span className="text-purple-600">{cart.totalPrice?.toFixed(2)} ₽</span>
        </div>
      </div>

      <div className="space-y-4">
        {cart.cartItems.map((item) => (
          <div key={item.cartItemId} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {item.product?.images && item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0].downloadUrl}
                    alt={item.product.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.product?.productName || 'Неизвестный товар'}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.product?.productBrand} {item.product?.productModel}
                </p>
                <div className="mt-1 flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Цена: {item.unitPrice?.toFixed(2)} ₽
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.product.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.product.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* Total Price and Remove Button */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {item.totalPrice?.toFixed(2)} ₽
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product.productId)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Button */}
      <div className="border-t pt-6">
        {showOrderSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span>Заказ успешно оформлен! Спасибо за покупку.</span>
              <button
                onClick={() => navigate('/account?tab=orders')}
                className="ml-4 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Посмотреть заказы
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            Итого: <span className="text-purple-600">{cart.totalPrice?.toFixed(2)} ₽</span>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isPlacingOrder
                ? 'bg-purple-400 text-white cursor-wait'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isPlacingOrder ? 'Оформляем заказ...' : 'Оформить заказ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
