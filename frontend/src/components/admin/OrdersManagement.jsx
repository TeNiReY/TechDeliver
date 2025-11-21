import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_ORDERS, UPDATE_ORDER_STATUS } from '../../graphql/queries';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';

const OrdersManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS);

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      refetch();
      setToast({ show: true, message: 'Статус заказа успешно обновлен!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при обновлении статуса: ' + error.message, type: 'error' });
    }
  });

  const orders = data?.getAllOrders || [];

  const filteredOrders = selectedStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statuses = [
    { value: 'ALL', label: 'Все', color: 'gray' },
    { value: 'PENDING', label: 'Ожидает', color: 'yellow' },
    { value: 'PROCESSING', label: 'В обработке', color: 'blue' },
    { value: 'SHIPPED', label: 'Отправлен', color: 'purple' },
    { value: 'DELIVERED', label: 'Доставлен', color: 'green' },
    { value: 'CANCELLED', label: 'Отменен', color: 'red' }
  ];

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'gray';
  };

  const getStatusLabel = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.label || status;
  };

  // Получить доступные статусы для перехода
  const getAvailableStatuses = (currentStatus) => {
    const transitions = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED', 'CANCELLED'],
      'DELIVERED': [], // Доставленный заказ нельзя изменить
      'CANCELLED': [] // Отмененный заказ нельзя изменить
    };
    
    return transitions[currentStatus] || [];
  };

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    const availableStatuses = getAvailableStatuses(currentStatus);
    
    if (!availableStatuses.includes(newStatus)) {
      setToast({ show: true, message: 'Невозможно изменить статус на выбранный!', type: 'error' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      orderId,
      newStatus,
      currentStatus
    });
  };

  const handleConfirmStatusChange = async () => {
    await updateOrderStatus({
      variables: {
        orderId: confirmDialog.orderId,
        status: confirmDialog.newStatus
      }
    });
    setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B39CD0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Ошибка загрузки заказов: {error.message}</div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Примечание:</strong> Для работы этого функционала необходимо добавить на бэкенде:
          </p>
          <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
            <li>Query: getAllOrders</li>
            <li>Mutation: updateOrderStatus(orderId: ID!, status: String!)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управление заказами</h2>
        <div className="text-sm text-gray-600">
          Всего заказов: <span className="font-semibold text-[#B39CD0]">{orders.length}</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedStatus === status.value
                ? 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label}
            {status.value !== 'ALL' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {orders.filter(o => o.status === status.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const statusColor = getStatusColor(order.status);
          
          return (
            <div 
              key={order.id} 
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Order Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">ID: {order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-800`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>📅 {new Date(order.orderDate).toLocaleString('ru-RU')}</div>
                      <div>📍 {order.deliveryAddress}</div>
                      <div>👤 User ID: {order.userId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#950740] mb-2">
                      {order.orderTotalPrice?.toFixed(2)} Br
                    </div>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="text-sm text-[#B39CD0] hover:text-[#950740] font-semibold transition-colors"
                    >
                      {isExpanded ? 'Скрыть детали ▲' : 'Показать детали ▼'}
                    </button>
                  </div>
                </div>

                {/* Status Actions */}
                {getAvailableStatuses(order.status).length > 0 && (
                  <div className="pt-4 border-t border-purple-200">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Доступные действия:</span>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableStatuses(order.status).map((statusValue) => {
                        const statusInfo = statuses.find(s => s.value === statusValue);
                        const isCancellation = statusValue === 'CANCELLED';
                        
                        return (
                          <button
                            key={statusValue}
                            onClick={() => handleStatusChange(order.id, statusValue, order.status)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              isCancellation
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-gradient-to-r from-[#950740] to-[#B39CD0] hover:shadow-lg text-white'
                            }`}
                          >
                            {isCancellation ? 'Отменить заказ' : statusInfo?.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {getAvailableStatuses(order.status).length === 0 && (
                  <div className="pt-4 border-t border-purple-200">
                    <span className="text-sm text-gray-500 italic">
                      {order.status === 'DELIVERED' ? 'Заказ доставлен' : 'Заказ отменен'}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Details */}
              {isExpanded && (
                <div className="bg-white/60 p-6 border-t border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Товары в заказе:</h4>
                  <div className="space-y-2">
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                        <div>
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.productBrand}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{item.quantity} × {item.price?.toFixed(2)} Br</div>
                          <div className="font-semibold text-gray-900">{(item.quantity * item.price)?.toFixed(2)} Br</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 bg-white rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Товары:</span>
                      <span className="font-semibold">{order.orderItemsTotalPrice?.toFixed(2)} Br</span>
                    </div>
                    {order.deliveryTotalPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Доставка:</span>
                        <span className="font-semibold">{order.deliveryTotalPrice?.toFixed(2)} Br</span>
                      </div>
                    )}
                    {order.installationPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Установка:</span>
                        <span className="font-semibold">{order.installationPrice?.toFixed(2)} Br</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Итого:</span>
                      <span className="text-[#950740]">{order.orderTotalPrice?.toFixed(2)} Br</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Заказы не найдены
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, currentStatus: null })}
        onConfirm={handleConfirmStatusChange}
        title={confirmDialog.newStatus === 'CANCELLED' ? 'Отменить заказ?' : 'Изменить статус заказа?'}
        message={
          confirmDialog.newStatus === 'CANCELLED'
            ? 'Вы уверены, что хотите отменить этот заказ? Это действие нельзя будет отменить.'
            : `Изменить статус заказа на "${getStatusLabel(confirmDialog.newStatus)}"?`
        }
        confirmText={confirmDialog.newStatus === 'CANCELLED' ? 'Да, отменить' : 'Изменить'}
        type={confirmDialog.newStatus === 'CANCELLED' ? 'danger' : 'default'}
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default OrdersManagement;
