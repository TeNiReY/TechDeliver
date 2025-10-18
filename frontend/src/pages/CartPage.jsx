import React from 'react';
import CartView from '../components/CartView';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartView />
      </div>
    </div>
  );
};

export default CartPage;
