import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_CATEGORIES, CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../../graphql/queries';
import Toast from '../Toast';
import ConfirmDialog from '../ConfirmDialog';

const CategoriesManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    installationComplexityCoefficient: '1.0'
  });

  const { data, loading, error, refetch } = useQuery(GET_ALL_CATEGORIES);

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      refetch();
      setShowModal(false);
      resetForm();
      setToast({ show: true, message: 'Категория успешно создана!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при создании категории: ' + error.message, type: 'error' });
    }
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      refetch();
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      setToast({ show: true, message: 'Категория успешно обновлена!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при обновлении категории: ' + error.message, type: 'error' });
    }
  });

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      refetch();
      setDeletingCategory(null);
      setToast({ show: true, message: 'Категория успешно удалена!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при удалении категории: ' + error.message, type: 'error' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      installationComplexityCoefficient: '1.0'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory({
        variables: {
          categoryId: editingCategory.categoryId,
          input: {
            name: formData.name,
            description: formData.description,
            installationComplexityCoefficient: parseFloat(formData.installationComplexityCoefficient)
          }
        }
      });
    } else {
      await createCategory({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            installationComplexityCoefficient: parseFloat(formData.installationComplexityCoefficient)
          }
        }
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.categoryName,
      description: category.categoryDescription || '',
      installationComplexityCoefficient: category.installationComplexityCoefficient?.toString() || '1.0'
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deletingCategory) {
      await deleteCategory({
        variables: {
          categoryId: deletingCategory.categoryId
        }
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    resetForm();
  };

  const categories = data?.getAllCategories?.categories || [];

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
        Ошибка загрузки категорий: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управление категориями</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          + Добавить категорию
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.categoryId} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.categoryName}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.categoryDescription}</p>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-[#B39CD0]">
                    ID: {category.categoryId}
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                    {category.products?.length || 0} товаров
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 pt-4 border-t border-purple-200">
              <button 
                onClick={() => handleEdit(category)}
                className="flex-1 px-4 py-2 bg-white text-[#B39CD0] rounded-lg font-semibold hover:bg-[#B39CD0] hover:text-white transition-all"
              >
                Изменить
              </button>
              <button 
                onClick={() => setDeletingCategory(category)}
                className="flex-1 px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Категории не найдены
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название категории *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Коэффициент сложности установки</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.installationComplexityCoefficient}
                  onChange={(e) => setFormData({...formData, installationComplexityCoefficient: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={creating || updating}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    creating || updating
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white hover:shadow-lg'
                  }`}
                >
                  {creating || updating 
                    ? (editingCategory ? 'Обновление...' : 'Создание...') 
                    : (editingCategory ? 'Обновить' : 'Создать категорию')
                  }
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={creating || updating}
                  className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        title="Удалить категорию?"
        message={deletingCategory ? `Вы уверены, что хотите удалить категорию "${deletingCategory.categoryName}"? Это действие нельзя отменить.` : ''}
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDelete}
        onClose={() => setDeletingCategory(null)}
        type="danger"
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

export default CategoriesManagement;
