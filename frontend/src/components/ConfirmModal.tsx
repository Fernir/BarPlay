import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Да, удалить',
  cancelText = 'Отмена',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantColors = {
    danger: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  };

  const colors = variantColors[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full animate-scaleIn">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${colors.bg}`}>
              <AlertTriangle size={20} className={colors.icon} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Сообщение */}
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
