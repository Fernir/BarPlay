import { useState } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise(false);
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={isOpen}
      title={options.title || 'Подтверждение'}
      message={options.message || 'Вы уверены?'}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      variant={options.variant || 'danger'}
    />
  );

  return { confirm, ConfirmModal: ConfirmModalComponent };
};
