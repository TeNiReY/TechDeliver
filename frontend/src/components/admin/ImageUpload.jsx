import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../Toast';
import ConfirmDialog from '../ConfirmDialog';

const ImageUpload = ({ productId, existingImages = [], onUploadSuccess, onClose }) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [localImages, setLocalImages] = useState(existingImages);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Синхронизируем локальное состояние с пропсами
  if (existingImages !== localImages && existingImages.length !== localImages.length) {
    setLocalImages(existingImages);
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Создаем превью для выбранных файлов
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setToast({ show: true, message: 'Выберите файлы для загрузки', type: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('productId', productId);

    try {
      const apiBase = import.meta.env.VITE_API_BASE || '';
      const response = await fetch(`${apiBase}/api/v1/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ show: true, message: 'Изображения успешно загружены!', type: 'success' });
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (onUploadSuccess) {
          onUploadSuccess(data.imageDto);
        }
      } else {
        setToast({ show: true, message: data.message || 'Ошибка загрузки', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Ошибка загрузки: ' + error.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirmDeleteId) return;
    
    setDeletingImageId(confirmDeleteId);
    setConfirmDeleteId(null);
    
    try {
      const apiBase = import.meta.env.VITE_API_BASE || '';
      const response = await fetch(`${apiBase}/api/v1/images/${confirmDeleteId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Обновляем локальное состояние сразу
        setLocalImages(prev => prev.filter(img => img.id !== confirmDeleteId));
        setToast({ show: true, message: 'Изображение удалено!', type: 'success' });
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        // Закрываем модальное окно после удаления
        if (onClose) {
          setTimeout(() => onClose(), 500);
        }
      } else {
        setToast({ show: true, message: data.message || 'Ошибка удаления', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Ошибка удаления: ' + error.message, type: 'error' });
    } finally {
      setDeletingImageId(null);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {localImages && localImages.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Текущие изображения ({localImages.length})</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {localImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.downloadUrl}
                  alt={image.fileName}
                  className={`w-full h-24 object-cover rounded-lg border border-gray-200 transition-opacity ${
                    deletingImageId === image.id ? 'opacity-50' : ''
                  }`}
                />
                {deletingImageId === image.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(image.id)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    title="Удалить изображение"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Загрузить новые изображения
        </label>
        <div className="flex items-center space-x-3">
          <label className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#B39CD0] transition-colors">
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  {selectedFiles.length > 0 
                    ? `Выбрано файлов: ${selectedFiles.length}` 
                    : 'Нажмите для выбора файлов'}
                </span>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preview Selected Files */}
      {previewUrls.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Выбранные файлы</h4>
            <button
              onClick={clearSelection}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Очистить
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {selectedFiles[index].name.substring(0, 15)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            uploading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white hover:shadow-lg'
          }`}
        >
          {uploading ? 'Загрузка...' : `Загрузить ${selectedFiles.length} файл(ов)`}
        </button>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDeleteImage}
        title="Удалить изображение?"
        message="Вы уверены, что хотите удалить это изображение? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
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

export default ImageUpload;
