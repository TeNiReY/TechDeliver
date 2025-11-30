import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_CATEGORIES, ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../../graphql/queries';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';
import ImageUpload from './ImageUpload';

const ProductsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductForImages, setSelectedProductForImages] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, productId: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    categoryNameOrId: '',
    price: '',
    quantity: '',
    brand: '',
    model: '',
    description: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_ALL_CATEGORIES);

  const [addProduct, { loading: adding }] = useMutation(ADD_PRODUCT, {
    onCompleted: () => {
      refetch();
      setShowModal(false);
      resetForm();
      setToast({ show: true, message: 'Товар успешно добавлен!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при добавлении товара: ' + error.message, type: 'error' });
    }
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      setShowModal(false);
      resetForm();
      setToast({ show: true, message: 'Товар успешно обновлен!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при обновлении товара: ' + error.message, type: 'error' });
    }
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch();
      setToast({ show: true, message: 'Товар успешно удален!', type: 'success' });
    },
    onError: (error) => {
      setToast({ show: true, message: 'Ошибка при удалении товара: ' + error.message, type: 'error' });
    }
  });

  const categories = data?.getAllCategories?.categories || [];
  const allProducts = categories.flatMap(category => 
    (category.products || []).map(product => ({
      ...product,
      categoryName: category.categoryName
    }))
  );

  const filteredProducts = allProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productBrand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Ошибка загрузки товаров: {error.message}
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      name: '',
      categoryNameOrId: '',
      price: '',
      quantity: '',
      brand: '',
      model: '',
      description: ''
    });
    setEditingProduct(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.productName,
      categoryNameOrId: product.productCategory?.categoryId || '',
      price: product.price,
      quantity: product.inventory.toString(),
      brand: product.productBrand || '',
      model: product.productModel || '',
      description: product.productDescription || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Обновление товара
      await updateProduct({
        variables: {
          productId: editingProduct.productId,
          input: {
            price: formData.price,
            inventory: parseInt(formData.quantity),
            description: formData.description
          }
        }
      });
    } else {
      // Добавление товара
      await addProduct({
        variables: {
          input: {
            name: formData.name,
            categoryNameOrId: formData.categoryNameOrId,
            price: formData.price,
            quantity: parseInt(formData.quantity),
            brand: formData.brand,
            model: formData.model,
            description: formData.description
          }
        }
      });
    }
  };

  const handleDelete = (productId) => {
    setConfirmDialog({ isOpen: true, productId });
  };

  const handleConfirmDelete = async () => {
    await deleteProduct({
      variables: { productId: confirmDialog.productId }
    });
    setConfirmDialog({ isOpen: false, productId: null });
  };

  const handleOpenImageModal = (product) => {
    setSelectedProductForImages(product);
    setShowImageModal(true);
  };

  const handleImageUploadSuccess = () => {
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управление товарами</h2>
        <button 
          onClick={handleOpenAddModal}
          className="px-6 py-3 bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          + Добавить товар
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Название</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Бренд</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Категория</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Цена</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Остаток</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                    <div className="truncate w-20" title={product.productId}>
                      {product.productId.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={product.productName}>
                      {product.productName}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={product.productBrand}>
                      {product.productBrand}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-[#B39CD0] whitespace-nowrap">
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {parseFloat(product.price || 0).toFixed(2)} Br
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      product.inventory > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.inventory > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inventory} шт.
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button 
                      onClick={() => handleOpenImageModal(product)}
                      className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                      title="Управление изображениями"
                    >
                      <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleOpenEditModal(product)}
                      className="text-[#B39CD0] hover:text-[#950740] mr-3 transition-colors"
                    >
                      Изменить
                    </button>
                    <button 
                      onClick={() => handleDelete(product.productId)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Товары не найдены
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название товара *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                    required
                    disabled={editingProduct}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория *</label>
                  <select
                    value={formData.categoryNameOrId}
                    onChange={(e) => setFormData({...formData, categoryNameOrId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                    required
                    disabled={editingProduct}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цена (Br) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Количество *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Бренд</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                    disabled={editingProduct}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Модель</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent"
                    disabled={editingProduct}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39CD0] focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={adding || updating}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    adding || updating
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white hover:shadow-lg'
                  }`}
                >
                  {adding || updating ? 'Сохранение...' : editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={adding || updating}
                  className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageModal && selectedProductForImages && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Изображения товара</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedProductForImages.productName}</p>
              </div>
              <button 
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ImageUpload
              productId={selectedProductForImages.productId}
              existingImages={selectedProductForImages.images || []}
              onUploadSuccess={handleImageUploadSuccess}
            />
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, productId: null })}
        onConfirm={handleConfirmDelete}
        title="Удалить товар?"
        message="Вы уверены, что хотите удалить этот товар? Это действие нельзя будет отменить."
        confirmText="Да, удалить"
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

export default ProductsManagement;
