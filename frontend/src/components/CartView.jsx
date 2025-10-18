import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART_QUERY } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const CartView = () => {
  const { user } = useAuth();
  
  const { data, loading, error } = useQuery(GET_CART_QUERY, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    onError: (error) => {
      console.error('Cart query error:', error);
    }
  });

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
                  <span className="text-sm text-gray-600">
                    Количество: {item.quantity}
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-medium text-gray-900">
                  {item.totalPrice?.toFixed(2)} ₽
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Button */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            Итого: <span className="text-purple-600">{cart.totalPrice?.toFixed(2)} ₽</span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
