import React from 'react';
import FavoritesView from '../components/FavoritesView';

const FavoritesPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#950740] via-[#B39CD0] to-purple-600 bg-clip-text text-transparent mb-2">
            Избранное
          </h1>
          <p className="text-gray-600">Ваши сохраненные товары</p>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 md:p-8 shadow-lg">
          <FavoritesView />
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
