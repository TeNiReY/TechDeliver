import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, UPDATE_USERNAME_MUTATION, UPDATE_PASSWORD_MUTATION } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const ProfileInfo = () => {
  const { user } = useAuth();
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Загружаем профиль пользователя
  const { data: profileData, loading: profileLoading, error: profileError, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    onError: (error) => {
      console.error('Profile query error:', error);
    }
  });

  const [updateUsernameMutation] = useMutation(UPDATE_USERNAME_MUTATION, {
    onCompleted: () => {
      refetch(); // Обновляем данные профиля после изменения
    }
  });
  const [updatePasswordMutation] = useMutation(UPDATE_PASSWORD_MUTATION);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newUsername.trim()) {
      setError('Введите новое имя пользователя');
      return;
    }

    if (newUsername.length < 3) {
      setError('Имя пользователя должно содержать минимум 3 символа');
      return;
    }

    if (!user?.userId) {
      setError('Ошибка: ID пользователя не найден. Попробуйте перезайти в систему.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await updateUsernameMutation({
        variables: {
          userId: user.userId,
          newUsername: newUsername.trim()
        }
      });

      if (data.updateUsername) {
        setSuccess('Имя пользователя успешно обновлено!');
        setNewUsername('');
        setEditingUsername(false);
      }
    } catch (err) {
      setError(err.message || 'Ошибка обновления имени пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordData.oldPassword) {
      setError('Введите текущий пароль');
      return;
    }

    if (!passwordData.newPassword) {
      setError('Введите новый пароль');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setError('Новый пароль должен отличаться от текущего');
      return;
    }

    if (!user?.userId) {
      setError('Ошибка: ID пользователя не найден. Попробуйте перезайти в систему.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await updatePasswordMutation({
        variables: {
          userId: user.userId,
          oldPass: passwordData.oldPassword,
          newPass: passwordData.newPassword
        }
      });

      if (data.updateUserPassword) {
        setSuccess('Пароль успешно обновлен!');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setEditingPassword(false);
      }
    } catch (err) {
      setError(err.message || 'Ошибка обновления пароля');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingUsername(false);
    setEditingPassword(false);
    setNewUsername('');
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  // Показываем загрузку профиля
  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Профиль</h2>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Загрузка профиля...</span>
        </div>
      </div>
    );
  }

  // Показываем ошибку загрузки профиля
  if (profileError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Профиль</h2>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Ошибка загрузки профиля: {profileError.message}
        </div>
      </div>
    );
  }

  const userProfile = profileData?.getUserProfileInfo;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#950740] to-[#B39CD0] bg-clip-text text-transparent">
            Профиль
          </h2>
          <p className="text-gray-600 text-sm mt-1">Управляйте своими личными данными</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg shadow-md flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 px-5 py-4 rounded-lg shadow-md flex items-start space-x-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* User ID Info */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">ID пользователя</label>
              <p className="mt-0.5 text-sm text-gray-900 font-mono font-semibold">{userProfile?.userId || user?.userId || 'Не указан'}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Активен
            </span>
          </div>
        </div>
      </div>

      {/* Email Info */}
      <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#950740] to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              Email
              <svg className="w-4 h-4 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </h3>
            <p className="mt-1 text-gray-700 font-medium">{userProfile?.email || 'Не указан'}</p>
          </div>
        </div>
      </div>

      {/* Roles Info */}
      {userProfile?.roles && userProfile.roles.length > 0 && (
        <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B39CD0] to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Роли</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {userProfile.roles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800 border border-purple-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Username Section */}
      <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#B39CD0] to-purple-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Имя пользователя</h3>
          </div>
          {!editingUsername && (
            <button
              onClick={() => setEditingUsername(true)}
              className="flex items-center space-x-2 text-[#950740] hover:text-[#7a052f] text-sm font-semibold transition-colors hover:scale-105 duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Изменить</span>
            </button>
          )}
        </div>

        {!editingUsername ? (
          <div className="flex items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900">
                  {userProfile?.username || 'Не указано'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUsernameSubmit} className="space-y-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div>
              <label htmlFor="newUsername" className="block text-sm font-semibold text-gray-700 mb-2">
                Новое имя пользователя
              </label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                minLength={3}
                className="block w-full px-4 py-3 border-2 border-purple-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#950740] focus:border-[#950740] transition-all"
                placeholder="Введите новое имя пользователя"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#950740] to-[#B39CD0] hover:from-[#7a052f] hover:to-[#9575CD] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Сохранение...
                  </span>
                ) : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#950740] to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Пароль</h3>
          </div>
          {!editingPassword && (
            <button
              onClick={() => setEditingPassword(true)}
              className="flex items-center space-x-2 text-[#950740] hover:text-[#7a052f] text-sm font-semibold transition-colors hover:scale-105 duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Изменить</span>
            </button>
          )}
        </div>

        {!editingPassword ? (
          <div className="flex items-center bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-400 tracking-widest">
                  ••••••••
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                id="oldPassword"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                required
                className="block w-full px-4 py-3 border-2 border-red-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#950740] focus:border-[#950740] transition-all"
                placeholder="Введите текущий пароль"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength={6}
                className="block w-full px-4 py-3 border-2 border-red-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#950740] focus:border-[#950740] transition-all"
                placeholder="Введите новый пароль (минимум 6 символов)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                className="block w-full px-4 py-3 border-2 border-red-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#950740] focus:border-[#950740] transition-all"
                placeholder="Повторите новый пароль"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#950740] to-[#B39CD0] hover:from-[#7a052f] hover:to-[#9575CD] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Сохранение...
                  </span>
                ) : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
