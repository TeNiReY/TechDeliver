import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../graphql/queries';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const apolloClient = useApolloClient();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Функция для декодирования JWT токена и получения userId
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; // subject содержит userId
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const [loadUserProfile] = useLazyQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      if (data?.getUserProfileInfo) {
        setUserProfile(data.getUserProfileInfo);
        setUser(prev => ({
          ...prev,
          roles: data.getUserProfileInfo.roles
        }));
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('Error loading user profile:', error);
      setLoading(false);
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (token) {
      // Получаем userId из localStorage или из токена
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = getUserIdFromToken(token);
        if (userId) {
          localStorage.setItem('userId', userId);
        }
      }
      setUser({ token, userId });
      // Загружаем профиль пользователя для получения ролей
      loadUserProfile({ variables: { userId } });
    } else {
      setLoading(false);
    }
  }, [token, loadUserProfile]);

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setToken(token);
    setUser({ token, userId });
    // Загружаем профиль для получения ролей
    loadUserProfile({ variables: { userId } });
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
    // Очищаем кеш Apollo при выходе
    await apolloClient.clearStore();
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const isAdmin = () => {
    // Проверяем наличие роли ADMIN
    return user?.roles?.includes('ADMIN') || false;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
