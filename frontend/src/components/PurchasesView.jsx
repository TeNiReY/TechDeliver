import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PurchasesView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data, loading, error } = useQuery(GET_USER_ORDERS, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    onError: (error) => {
      console.error('Orders query error:', error);
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Неверная дата';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#B39CD0]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-6 h-6 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span className="mt-4 text-gray-700 font-medium">Загрузка покупок...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-6 shadow-md">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-1">Ошибка загрузки</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const allOrders = data?.getUserOrders || [];
  
  // Только завершенные заказы (доставленные)
  const completedOrders = allOrders.filter(order => order.status?.toLowerCase() === 'delivered');

  if (completedOrders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Завершенных покупок пока нет
        </h3>
        <p className="text-gray-600 mb-6">Ваши доставленные заказы будут отображаться здесь</p>
        <a href="/catalog" className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#950740] to-[#B39CD0] hover:from-[#7a052f] hover:to-[#9575CD] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Начать покупки</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Мои покупки
          </h2>
          <p className="text-gray-600 text-sm mt-1">Завершенные и доставленные заказы</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border border-green-200">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">
            Всего: {completedOrders.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {completedOrders.map((order) => (
          <div key={order.id} className="bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-2xl p-6 hover:border-green-400 hover:shadow-xl transition-all duration-300">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-green-100">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Заказ #{order.id}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Доставлен
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(order.orderDate)}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Сумма</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {order.orderTotalPrice?.toFixed(2)} Br
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h4 className="text-sm font-bold text-gray-900">Купленные товары</h4>
              </div>
              <div className="space-y-2">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-xl border border-green-100 hover:border-green-300 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {item.quantity}×
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.productBrand}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-base font-bold text-green-600">
                        {(item.quantity * item.price)?.toFixed(2)} Br
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 mb-4">
                <div className="flex items-start text-sm">
                  <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-700">Адрес доставки:</span>
                    <p className="text-gray-600 mt-0.5">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Footer */}
            <div className="border-t-2 border-green-100 pt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-mono font-semibold">ID: {order.id}</span>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center space-x-1 transition-colors"
              >
                <span>Все заказы</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesView;
