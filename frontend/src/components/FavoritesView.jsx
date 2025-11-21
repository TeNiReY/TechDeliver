import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_SAVED_PRODUCTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from './ProductCard';

const FavoritesView = () => {
  const { user } = useAuth();
  const { refreshFavorites } = useFavorites();
  const { loading, error, data, refetch } = useQuery(GET_USER_SAVED_PRODUCTS, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
  });

  const handleRemoveProduct = (productId) => {
    refetch();
    refreshFavorites();
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
        <p className="text-red-500">Ошибка загрузки избранного: {error.message}</p>
      </div>
    );
  }

  const savedProducts = data?.getUserSavedProducts || [];

  if (savedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Избранное пусто</h3>
        <p className="text-gray-500">Сохраняйте понравившиеся товары, нажимая на сердечко</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Избранное</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProducts.map((product) => (
          <ProductCard 
            key={product.productId} 
            product={product}
            onRemove={handleRemoveProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;
