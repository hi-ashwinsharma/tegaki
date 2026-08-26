import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-none" onClick={onClose} />

      <div
        className="relative w-full max-w-md p-6 rounded-2xl z-10 animate-fade-in select-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border-soft)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-md hover:opacity-75 cursor-pointer"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-soft)',
              color: '#EF4444',
            }}
          >
            <AlertTriangle size={18} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Delete Thought Permanently?
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Are you sure you want to delete <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>&ldquo;{title || 'Untitled'}&rdquo;</span>? This will erase it from your device and Cloud Firestore. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-full hover:opacity-75 cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 text-xs font-medium rounded-full flex items-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: '1px solid #EF4444',
            }}
          >
            <Trash2 size={13} strokeWidth={2} />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
