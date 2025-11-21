const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Подтвердить', cancelText = 'Отмена', type = 'default' }) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          button: 'bg-red-500 hover:bg-red-600',
          icon: 'text-red-500',
          iconBg: 'bg-red-100'
        };
      case 'success':
        return {
          button: 'bg-green-500 hover:bg-green-600',
          icon: 'text-green-500',
          iconBg: 'bg-green-100'
        };
      default:
        return {
          button: 'bg-gradient-to-r from-[#950740] to-[#B39CD0] hover:shadow-lg',
          icon: 'text-[#B39CD0]',
          iconBg: 'bg-purple-100'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all ${colors.button}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
