import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, SET_DELIVERY_ADDRESS_MUTATION } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const DeliveryAddressView = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
  });

  const [setDeliveryAddress, { loading: saving }] = useMutation(SET_DELIVERY_ADDRESS_MUTATION, {
    onCompleted: () => {
      setSaveSuccess(true);
      setIsEditing(false);
      refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (error) => {
      console.error('Error saving address:', error);
      alert('Ошибка при сохранении адреса');
    }
  });

  const handleSaveAddress = async () => {
    if (!newAddress.trim()) {
      alert('Введите адрес доставки');
      return;
    }

    try {
      await setDeliveryAddress({
        variables: {
          userId: user.userId,
          address: newAddress.trim()
        }
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEditClick = () => {
    setNewAddress(data?.getUserProfileInfo?.savedDeliveryAddress || '');
    setIsEditing(true);
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
        <p className="text-red-500">Ошибка загрузки данных: {error.message}</p>
      </div>
    );
  }

  const currentAddress = data?.getUserProfileInfo?.savedDeliveryAddress;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Адреса доставки</h2>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Адрес успешно сохранен!
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-4">
          {currentAddress ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-[#B39CD0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-[#950740]">Основной адрес</span>
                  </div>
                  <p className="text-gray-800 text-lg">{currentAddress}</p>
                </div>
                <button
                  onClick={handleEditClick}
                  className="ml-4 px-4 py-2 bg-[#B39CD0] text-white rounded-lg hover:bg-[#9575CD] transition-colors"
                >
                  Изменить
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Адрес не указан</h3>
              <p className="text-gray-500 mb-4">Добавьте адрес для быстрой доставки</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#B39CD0] text-white rounded-lg hover:bg-[#9575CD] transition-colors font-semibold"
              >
                Добавить адрес
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">
            {currentAddress ? 'Изменить адрес доставки' : 'Добавить адрес доставки'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес доставки
              </label>
              <textarea
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Введите полный адрес доставки (город, улица, дом, квартира)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent resize-none"
                rows="3"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveAddress}
                disabled={saving}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#B39CD0] text-white hover:bg-[#9575CD]'
                }`}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewAddress('');
                }}
                disabled={saving}
                className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressView;
