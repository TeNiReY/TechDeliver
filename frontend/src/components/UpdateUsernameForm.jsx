import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USERNAME_MUTATION } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const UpdateUsernameForm = () => {
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  
  const [updateUsernameMutation] = useMutation(UPDATE_USERNAME_MUTATION);

  const handleSubmit = async (e) => {
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
      console.log('Updating username for userId:', user.userId);
      const { data } = await updateUsernameMutation({
        variables: {
          userId: user.userId,
          newUsername: newUsername.trim()
        }
      });

      if (data.updateUsername) {
        setSuccess('Имя пользователя успешно обновлено!');
        setNewUsername('');
      }
    } catch (err) {
      setError(err.message || 'Ошибка обновления имени пользователя');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Изменить имя пользователя</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите новое имя пользователя"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Обновление...' : 'Обновить имя пользователя'}
        </button>
      </form>
    </div>
  );
};

export default UpdateUsernameForm;
