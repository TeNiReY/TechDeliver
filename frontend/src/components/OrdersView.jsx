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
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Заказ #{order.id}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {order.totalAmount?.toFixed(2)} ₽
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Товары в заказе:</h4>
              <div className="space-y-2">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
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

            {/* Order Actions */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ID заказа: {order.id}
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-300 rounded transition-colors">
                    Повторить заказ
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded transition-colors">
                    Подробнее
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
