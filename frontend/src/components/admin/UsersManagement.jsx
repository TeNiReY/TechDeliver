import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS, BLOCK_USER, UNBLOCK_USER } from '../../graphql/queries';
import Toast from '../Toast';
import ConfirmDialog from '../ConfirmDialog';

const UsersManagement = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [blockingUser, setBlockingUser] = useState(null);
  const [unblockingUser, setUnblockingUser] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);

  const [blockUser, { loading: blocking }] = useMutation(BLOCK_USER, {
    onCompleted: () => {
      refetch();
      setBlockingUser(null);
      setToast({ show: true, message: 'Пользователь заблокирован!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка блокировки: ' + error.message, type: 'error' });
    }
  });

  const [unblockUser, { loading: unblocking }] = useMutation(UNBLOCK_USER, {
    onCompleted: () => {
      refetch();
      setUnblockingUser(null);
      setToast({ show: true, message: 'Пользователь разблокирован!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка разблокировки: ' + error.message, type: 'error' });
    }
  });

  const handleBlock = async () => {
    if (blockingUser) {
      await blockUser({ variables: { userId: blockingUser.userId } });
    }
  };

  const handleUnblock = async () => {
    if (unblockingUser) {
      await unblockUser({ variables: { userId: unblockingUser.userId } });
    }
  };

  const isUserBlocked = (user) => {
    return user.roles?.some(role => role === 'BLOCKED' || role === 'ROLE_BLOCKED');
  };

  const users = data?.getAllUsers || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B39CD0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Ошибка загрузки пользователей: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управление пользователями</h2>
        <div className="text-sm text-gray-600">
          Всего пользователей: <span className="font-semibold text-[#B39CD0]">{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Имя пользователя</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Роли</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Адрес доставки</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {user.userId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.username || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map((role, index) => {
                      const roleDisplay = role.replace('ROLE_', '');
                      let colorClass = 'bg-blue-100 text-blue-800';
                      
                      if (roleDisplay === 'ADMIN') {
                        colorClass = 'bg-red-100 text-red-800';
                      } else if (roleDisplay === 'BLOCKED') {
                        colorClass = 'bg-gray-100 text-gray-800';
                      }
                      
                      return (
                        <span 
                          key={index}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
                        >
                          {roleDisplay}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {user.savedDeliveryAddress || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {isUserBlocked(user) ? (
                    <button
                      onClick={() => setUnblockingUser(user)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                    >
                      Разблокировать
                    </button>
                  ) : (
                    <button
                      onClick={() => setBlockingUser(user)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                    >
                      Заблокировать
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Пользователи не найдены
        </div>
      )}

      {/* Confirm Block Dialog */}
      <ConfirmDialog
        isOpen={!!blockingUser}
        title="Заблокировать пользователя?"
        message={blockingUser ? `Вы уверены, что хотите заблокировать пользователя "${blockingUser.username || blockingUser.email}"?` : ''}
        confirmText="Заблокировать"
        cancelText="Отмена"
        onConfirm={handleBlock}
        onClose={() => setBlockingUser(null)}
        type="danger"
      />

      {/* Confirm Unblock Dialog */}
      <ConfirmDialog
        isOpen={!!unblockingUser}
        title="Разблокировать пользователя?"
        message={unblockingUser ? `Вы уверены, что хотите разблокировать пользователя "${unblockingUser.username || unblockingUser.email}"?` : ''}
        confirmText="Разблокировать"
        cancelText="Отмена"
        onConfirm={handleUnblock}
        onClose={() => setUnblockingUser(null)}
        type="success"
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default UsersManagement;
