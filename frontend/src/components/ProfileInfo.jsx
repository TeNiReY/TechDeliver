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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Профиль</h2>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* User ID Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID пользователя</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">{userProfile?.userId || user?.userId || 'Не указан'}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Активен
            </span>
          </div>
        </div>
      </div>

      {/* Email Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Email</h3>
            <p className="mt-1 text-sm text-gray-600">{userProfile?.email || 'Не указан'}</p>
          </div>
        </div>
      </div>

      {/* Roles Info */}
      {userProfile?.roles && userProfile.roles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Роли</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {userProfile.roles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Username Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Имя пользователя</h3>
          {!editingUsername && (
            <button
              onClick={() => setEditingUsername(true)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
            >
              Изменить
            </button>
          )}
        </div>

        {!editingUsername ? (
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                  {userProfile?.username || 'Не указано'}
              </p>
              {/*<p className="text-lg font-medium text-gray-900">*/}
              {/*  {userProfile?.username || 'Не указано'}*/}
              {/*</p>*/}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
                Новое имя пользователя
              </label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                minLength={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Введите новое имя пользователя"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Пароль</h3>
          {!editingPassword && (
            <button
              onClick={() => setEditingPassword(true)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
            >
              Изменить
            </button>
          )}
        </div>

        {!editingPassword ? (
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                  ••••••••
              </p>
              {/*<p className="text-lg font-medium text-gray-900">*/}
              {/*  ••••••••*/}
              {/*</p>*/}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                Текущий пароль
              </label>
              <input
                type="password"
                id="oldPassword"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Введите текущий пароль"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Новый пароль
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Введите новый пароль"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Подтвердите новый пароль"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
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
