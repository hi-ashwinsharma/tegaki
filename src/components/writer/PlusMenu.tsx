import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Link2, Code2, Minus, Upload, X } from 'lucide-react';

interface PlusMenuProps {
  top: number;
  isOpen: boolean;
  onToggle: () => void;
  onInsertImage: (url: string, caption?: string) => void;
  onInsertEmbed: (url: string, title?: string) => void;
  onInsertCode: () => void;
  onInsertDivider: () => void;
}

export const PlusMenu: React.FC<PlusMenuProps> = ({
  top,
  isOpen,
  onToggle,
  onInsertImage,
  onInsertEmbed,
  onInsertCode,
  onInsertDivider,
}) => {
  const [modalType, setModalType] = useState<'image' | 'embed' | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [inputCaption, setInputCaption] = useState('');

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onInsertImage(inputUrl.trim(), inputCaption.trim());
      setInputUrl('');
      setInputCaption('');
      setModalType(null);
      onToggle();
    }
  };

  const handleEmbedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onInsertEmbed(inputUrl.trim(), inputCaption.trim() || inputUrl.trim());
      setInputUrl('');
      setInputCaption('');
      setModalType(null);
      onToggle();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64 = loadEvt.target?.result as string;
        onInsertImage(base64, file.name);
        setModalType(null);
        onToggle();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div
        className="absolute left-[-44px] sm:left-[-52px] z-20 flex items-center transition-all duration-150 select-none"
        style={{ top: top || 0 }}
      >
        {/* The Left-Side Plus (+) Button */}
        <button
          type="button"
          onClick={onToggle}
          title="Add block"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:opacity-85 cursor-pointer"
          style={{
            border: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-secondary)',
            transform: isOpen ? 'rotate(45deg)' : 'none',
          }}
        >
          <Plus size={16} strokeWidth={1.8} />
        </button>

        {/* Medium-style 4-tool expansion palette */}
        {isOpen && (
          <div className="flex items-center gap-2 ml-2.5 animate-fade-in">
            <button
              type="button"
              onClick={() => setModalType('image')}
              title="Add Image"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <ImageIcon size={14} strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setModalType('embed')}
              title="Embed Web Card"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <Link2 size={14} strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => {
                onInsertCode();
                onToggle();
              }}
              title="Add Code Block"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <Code2 size={14} strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => {
                onInsertDivider();
                onToggle();
              }}
              title="Add Divider"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <Minus size={14} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      {/* Embed & Image Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div
            className="w-full max-w-md p-6 rounded-lg relative animate-fade-in"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-1 rounded-md hover:opacity-75 cursor-pointer"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {modalType === 'image' ? 'Insert Image' : 'Embed Website Link'}
            </h3>

            {modalType === 'image' && (
              <div className="mb-4">
                <label
                  className="flex flex-col items-center justify-center py-4 px-3 rounded-md cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px dashed var(--color-border-soft)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <Upload size={18} className="mb-1 opacity-75" />
                  <span className="text-xs">Upload from device or drag image here</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="text-center my-2 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  — OR VIA URL —
                </div>
              </div>
            )}

            <form onSubmit={modalType === 'image' ? handleImageSubmit : handleEmbedSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  {modalType === 'image' ? 'Image Web URL' : 'Website URL'}
                </label>
                <input
                  type="url"
                  required
                  autoFocus
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-md focus:outline-none"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  {modalType === 'image' ? 'Caption (Optional)' : 'Title / Note (Optional)'}
                </label>
                <input
                  type="text"
                  value={inputCaption}
                  onChange={(e) => setInputCaption(e.target.value)}
                  placeholder={modalType === 'image' ? 'Caption...' : 'Website description...'}
                  className="w-full px-3 py-2 text-xs rounded-md focus:outline-none"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full hover:opacity-75 cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium rounded-full cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-text-primary)',
                    color: 'var(--color-bg)',
                    border: '1px solid var(--color-text-primary)',
                  }}
                >
                  Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
