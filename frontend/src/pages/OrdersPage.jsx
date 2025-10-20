import React from 'react';
import OrdersView from '../components/OrdersView';

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersView />
      </div>
    </div>
  );
};

export default OrdersPage;
