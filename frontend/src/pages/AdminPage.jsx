import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Dashboard from '../components/admin/Dashboard';
import ProductsManagement from '../components/admin/ProductsManagement';
import CategoriesManagement from '../components/admin/CategoriesManagement';
import UsersManagement from '../components/admin/UsersManagement';
import OrdersManagement from '../components/admin/OrdersManagement';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Если не админ - редирект на главную
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Дашборд', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'orders', name: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'products', name: 'Товары', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'categories', name: 'Категории', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'users', name: 'Пользователи', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrdersManagement />;
      case 'products':
        return <ProductsManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#950740] via-[#B39CD0] to-purple-600 bg-clip-text text-transparent mb-2">
            Админ-панель
          </h1>
          <p className="text-gray-600">Управление товарами, категориями и пользователями</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white rounded-t-2xl'
                    : 'text-gray-600 hover:text-[#950740] hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
