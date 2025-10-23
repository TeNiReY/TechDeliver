import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const OrdersView = () => {
  const { user } = useAuth();
  
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
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Неверная дата';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status || 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Загрузка заказов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Ошибка загрузки заказов: {error.message}
      </div>
    );
  }

  const orders = data?.getUserOrders || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Заказов пока нет</h3>
        <p className="text-gray-500">Ваши заказы будут отображаться здесь после оформления</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Мои заказы</h2>
        <div className="text-sm text-gray-500">
          Всего заказов: {orders.length}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#950740] transition-colors">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Заказ #{order.id}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {formatDate(order.orderDate)}
                </p>
                {order.deliveryAddress && (
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {order.deliveryAddress}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#950740] mb-1">
                  {order.orderTotalPrice?.toFixed(2)} ₽
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            {/* Delivery Information */}
            {(order.distanceInKM || order.deliveryUrgency) && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2m6 2a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2" />
                  </svg>
                  Информация о доставке
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {order.distanceInKM && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Расстояние:</span>
                      <span className="font-medium text-gray-900">{order.distanceInKM} км</span>
                    </div>
                  )}
                  {order.deliveryUrgency && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Срочность:</span>
                      <span className="font-medium text-gray-900">
                        {order.deliveryUrgency === 'STANDARD' ? 'Стандартная' : 'Срочная'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Товары в заказе:</h4>
              <div className="space-y-2">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.productBrand}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {item.quantity} шт. × {item.price?.toFixed(2)} ₽
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {(item.quantity * item.price)?.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            {(order.orderItemsTotalPrice || order.deliveryTotalPrice) && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Детализация стоимости:</h4>
                <div className="space-y-1 text-sm">
                  {order.orderItemsTotalPrice && (
                    <div className="flex justify-between text-gray-700">
                      <span>Товары:</span>
                      <span className="font-medium">{order.orderItemsTotalPrice.toFixed(2)} ₽</span>
                    </div>
                  )}
                  {order.deliveryTotalPrice && (
                    <div className="flex justify-between text-gray-700">
                      <span>Доставка:</span>
                      <span className="font-medium">{order.deliveryTotalPrice.toFixed(2)} ₽</span>
                    </div>
                  )}
                  <div className="border-t border-purple-300 pt-2 flex justify-between text-base font-bold text-[#950740]">
                    <span>Итого:</span>
                    <span>{order.orderTotalPrice?.toFixed(2)} ₽</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Footer */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  ID заказа: {order.id}
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-[#950740] hover:text-[#7a052f] border border-[#950740] hover:border-[#7a052f] rounded-lg transition-colors font-medium">
                    Повторить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersView;
