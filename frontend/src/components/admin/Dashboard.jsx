import { useQuery } from '@apollo/client';
import { GET_ALL_ORDERS, GET_ALL_CATEGORIES, GET_ALL_USERS } from '../../graphql/queries';

const Dashboard = () => {
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ALL_ORDERS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_ALL_CATEGORIES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS);

  const orders = ordersData?.getAllOrders || [];
  const categories = categoriesData?.getAllCategories?.categories || [];
  const users = usersData?.getAllUsers || [];

  // Статистика по заказам
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  // Общая выручка
  const totalRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, order) => sum + (order.orderTotalPrice || 0), 0);

  // Средний чек
  const averageOrder = orderStats.delivered > 0 ? totalRevenue / orderStats.delivered : 0;

  // Статистика по категориям
  const categoryStats = categories.map(cat => ({
    name: cat.categoryName,
    productsCount: cat.products?.length || 0,
    totalInventory: cat.products?.reduce((sum, p) => sum + (p.inventory || 0), 0) || 0
  })).sort((a, b) => b.productsCount - a.productsCount);

  // Топ товары по остаткам
  const allProducts = categories.flatMap(cat => cat.products || []);
  const lowStockProducts = allProducts
    .filter(p => p.inventory < 10 && p.inventory > 0)
    .sort((a, b) => a.inventory - b.inventory)
    .slice(0, 5);

  const loading = ordersLoading || categoriesLoading || usersLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B39CD0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Панель управления</h2>
        <p className="text-gray-600">Общая статистика и аналитика</p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Всего заказов</span>
            <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{orderStats.total}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Выручка</span>
            <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{totalRevenue.toFixed(2)} Br</div>
          <div className="text-green-100 text-xs mt-1">Средний чек: {averageOrder.toFixed(2)} Br</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Товаров</span>
            <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{allProducts.length}</div>
          <div className="text-purple-100 text-xs mt-1">В {categories.length} категориях</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-pink-100 text-sm font-medium">Пользователей</span>
            <svg className="w-8 h-8 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{users.length}</div>
        </div>
      </div>

      {/* Статистика заказов */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Статус заказов</h3>
        <div className="space-y-3">
          {[
            { label: 'Ожидает', value: orderStats.pending, color: 'bg-yellow-500', total: orderStats.total },
            { label: 'В обработке', value: orderStats.processing, color: 'bg-blue-500', total: orderStats.total },
            { label: 'Отправлен', value: orderStats.shipped, color: 'bg-purple-500', total: orderStats.total },
            { label: 'Доставлен', value: orderStats.delivered, color: 'bg-green-500', total: orderStats.total },
            { label: 'Отменен', value: orderStats.cancelled, color: 'bg-red-500', total: orderStats.total },
          ].map((stat) => {
            const percentage = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
            return (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{stat.label}</span>
                  <span className="text-gray-600">{stat.value} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Категории */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Товары по категориям</h3>
          <div className="space-y-3">
            {categoryStats.slice(0, 5).map((cat) => {
              const maxProducts = Math.max(...categoryStats.map(c => c.productsCount));
              const percentage = maxProducts > 0 ? (cat.productsCount / maxProducts) * 100 : 0;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <span className="text-gray-600">{cat.productsCount} товаров</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#950740] to-[#B39CD0] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Товары с низким остатком */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Товары с низким остатком</h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{product.productName}</div>
                    <div className="text-xs text-gray-500">{product.productBrand}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {product.inventory} шт.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Все товары в наличии</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
