import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const OrdersView = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = React.useState('all');
  
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
      <div className="flex flex-col justify-center items-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#B39CD0]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-6 h-6 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <span className="mt-4 text-gray-700 font-medium">Загрузка заказов...</span>
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
            <h3 className="text-lg font-bold text-red-800 mb-1">Ошибка загрузки заказов</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const allOrders = data?.getUserOrders || [];
  
  // Фильтрация заказов по статусу
  const orders = statusFilter === 'all' 
    ? allOrders 
    : allOrders.filter(order => {
        if (statusFilter === 'completed') {
          return order.status?.toLowerCase() === 'delivered';
        }
        if (statusFilter === 'active') {
          return ['pending', 'processing', 'shipped'].includes(order.status?.toLowerCase());
        }
        return order.status?.toLowerCase() === statusFilter;
      });

  // Подсчет заказов по статусам
  const statusCounts = {
    all: allOrders.length,
    active: allOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status?.toLowerCase())).length,
    completed: allOrders.filter(o => o.status?.toLowerCase() === 'delivered').length,
    cancelled: allOrders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
  };

  if (allOrders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#950740] to-[#B39CD0] bg-clip-text text-transparent mb-2">
          Заказов пока нет
        </h3>
        <p className="text-gray-600 mb-6">Ваши заказы будут отображаться здесь после оформления</p>
        <a href="/" className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#950740] to-[#B39CD0] hover:from-[#7a052f] hover:to-[#9575CD] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#950740] to-[#B39CD0] bg-clip-text text-transparent">
            Мои заказы
          </h2>
          <p className="text-gray-600 text-sm mt-1">История ваших покупок</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-xl border border-purple-200">
          <svg className="w-5 h-5 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">
            Показано: {orders.length} из {allOrders.length}
          </span>
        </div>
      </div>

      {/* Фильтры по статусу */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Все ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'active'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Активные ({statusCounts.active})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Завершенные ({statusCounts.completed})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Отмененные ({statusCounts.cancelled})
          </button>
        </div>
      </div>

      {/* Сообщение если нет заказов с выбранным фильтром */}
      {orders.length === 0 && allOrders.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Заказов с таким статусом не найдено
          </h3>
          <p className="text-gray-600">Попробуйте выбрать другой фильтр</p>
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="bg-white bg-opacity-90 backdrop-blur-sm border-2 border-purple-100 rounded-2xl p-6 hover:border-[#950740] hover:shadow-xl transition-all duration-300">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-purple-100">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#950740] to-[#B39CD0] rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Заказ #{order.id}
                  </h3>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1.5 text-[#B39CD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(order.orderDate)}
                  </div>
                </div>
                {order.deliveryAddress && (
                  <div className="flex items-start text-sm text-gray-600 mt-2 bg-blue-50 px-3 py-2 rounded-lg inline-flex">
                    <svg className="w-4 h-4 mr-1.5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{order.deliveryAddress}</span>
                  </div>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-3 border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">Сумма заказа</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#950740] to-[#B39CD0] bg-clip-text text-transparent">
                    {order.orderTotalPrice?.toFixed(2)} Br
                  </div>
                </div>
                <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-md ${getStatusColor(order.status)}`}>
                  <span className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></span>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            {/* Delivery Information */}
            {(order.distanceInKM || order.deliveryUrgency) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-xl p-4 mb-5 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2m6 2a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Информация о доставке</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {order.distanceInKM && (
                    <div className="bg-white bg-opacity-60 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Расстояние</div>
                      <div className="text-lg font-bold text-gray-900">{order.distanceInKM} км</div>
                    </div>
                  )}
                  {order.deliveryUrgency && (
                    <div className="bg-white bg-opacity-60 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Срочность</div>
                      <div className="text-lg font-bold text-gray-900">
                        {order.deliveryUrgency === 'STANDARD' ? 'Стандартная' : order.deliveryUrgency === 'NEXT_DAY' ? 'Ускоренная' : 'Экстренная'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-5">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-[#B39CD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h4 className="text-sm font-bold text-gray-900">Товары в заказе</h4>
              </div>
              <div className="space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.productBrand}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-600">
                        {item.quantity} × {item.price?.toFixed(2)} Br
                      </p>
                      <p className="text-base font-bold text-[#950740] mt-0.5">
                        {(item.quantity * item.price)?.toFixed(2)} Br
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            {(order.orderItemsTotalPrice || order.deliveryTotalPrice || order.installationPrice) && (
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-5 shadow-md">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-5 h-5 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h4 className="text-sm font-bold text-gray-900">Детализация стоимости</h4>
                </div>
                <div className="space-y-3">
                  {order.orderItemsTotalPrice && (
                    <div className="flex justify-between items-center bg-white bg-opacity-60 rounded-lg p-3">
                      <span className="text-sm text-gray-700 font-medium">Товары</span>
                      <span className="text-base font-bold text-gray-900">{order.orderItemsTotalPrice.toFixed(2)} Br</span>
                    </div>
                  )}
                  {order.deliveryTotalPrice && (
                    <div className="flex justify-between items-center bg-white bg-opacity-60 rounded-lg p-3">
                      <span className="text-sm text-gray-700 font-medium">Доставка</span>
                      <span className="text-base font-bold text-gray-900">{order.deliveryTotalPrice.toFixed(2)} Br</span>
                    </div>
                  )}
                  {order.installationPrice > 0 && (
                    <div className="flex justify-between items-center bg-white bg-opacity-60 rounded-lg p-3">
                      <span className="text-sm text-gray-700 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Установка
                      </span>
                      <span className="text-base font-bold text-gray-900">{order.installationPrice.toFixed(2)} Br</span>
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-[#950740] to-[#B39CD0] rounded-xl p-4 flex justify-between items-center shadow-lg">
                    <span className="text-white font-bold">Итого</span>
                    <span className="text-2xl font-bold text-white">{order.orderTotalPrice?.toFixed(2)} Br</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Footer */}
            <div className="border-t-2 border-purple-100 pt-4 mt-5">
              <div className="flex justify-end items-center">
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-mono font-semibold">ID: {order.id}</span>
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
