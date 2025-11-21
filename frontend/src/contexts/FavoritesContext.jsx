import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SAVED_PRODUCT_IDS } from '../graphql/queries';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState([]);

  const { data, refetch } = useQuery(GET_SAVED_PRODUCT_IDS, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    onCompleted: (data) => {
      setSavedProductIds(data?.getSavedProductsIds || []);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data?.getSavedProductsIds) {
      setSavedProductIds(data.getSavedProductsIds);
    }
  }, [data]);

  // Очищаем список избранного при выходе пользователя
  useEffect(() => {
    if (!user?.userId) {
      setSavedProductIds([]);
    }
  }, [user]);

  // Проверка, сохранен ли товар
  const isSaved = (productId) => {
    return savedProductIds.includes(productId.toString());
  };

  // Добавление товара в избранное (локально)
  const addToFavorites = (productId) => {
    setSavedProductIds(prev => [...prev, productId.toString()]);
  };

  // Удаление товара из избранного (локально)
  const removeFromFavorites = (productId) => {
    setSavedProductIds(prev => prev.filter(id => id !== productId.toString()));
  };

  // Переключение состояния избранного
  const toggleFavorite = (productId) => {
    if (isSaved(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  // Обновление списка с сервера
  const refreshFavorites = () => {
    if (user?.userId) {
      refetch();
    }
  };

  const value = {
    savedProductIds,
    isSaved,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
