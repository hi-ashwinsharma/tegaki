import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

export const Toast: React.FC<{ toast: ToastMessage | null; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 text-sm rounded-md transition-all animate-fade-in"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-soft)',
        color: 'var(--color-text-primary)',
      }}
    >
      {toast.type === 'success' && <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />}
      {toast.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
      <span>{toast.text}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        <X size={14} style={{ color: 'var(--color-text-tertiary)' }} />
      </button>
    </div>
  );
};
