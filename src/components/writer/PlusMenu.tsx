import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Link as LinkIcon, Code, Minus, Upload } from 'lucide-react';

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
    if (inputUrl) {
      onInsertImage(inputUrl, inputCaption);
      setInputUrl('');
      setInputCaption('');
      setModalType(null);
      onToggle();
    }
  };

  const handleEmbedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      onInsertEmbed(inputUrl, inputCaption || inputUrl);
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
        className="absolute left-[-48px] sm:left-[-54px] z-20 flex items-center transition-all duration-150 select-none"
        style={{ top: top || 0 }}
      >
        {/* The Left-Side Plus (+) Button */}
        <button
          type="button"
          onClick={onToggle}
          title="Add an element"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:opacity-85"
          style={{
            border: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-secondary)',
            transform: isOpen ? 'rotate(45deg)' : 'none',
          }}
        >
          <Plus size={18} />
        </button>

        {/* Medium-style 4-tool expansion palette */}
        {isOpen && (
          <div className="flex items-center gap-2 ml-3 animate-fade-in">
            <button
              type="button"
              onClick={() => setModalType('image')}
              title="Add an Image (URL or upload)"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <ImageIcon size={15} />
            </button>

            <button
              type="button"
              onClick={() => setModalType('embed')}
              title="Embed website or video link"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <LinkIcon size={15} />
            </button>

            <button
              type="button"
              onClick={() => {
                onInsertCode();
                onToggle();
              }}
              title="Add a Code block"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <Code size={15} />
            </button>

            <button
              type="button"
              onClick={() => {
                onInsertDivider();
                onToggle();
              }}
              title="Add a Separator / Divider"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-accent)',
              }}
            >
              <Minus size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Embed & Image Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div
            className="w-full max-w-md p-6 rounded-lg relative"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <h3 className="text-lg font-serif font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {modalType === 'image' ? 'Insert Image' : 'Embed Web Link or Card'}
            </h3>

            {modalType === 'image' && (
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  Upload from Device
                </label>
                <label
                  className="flex flex-col items-center justify-center py-4 px-3 rounded-md cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px dashed var(--color-border-soft)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <Upload size={20} className="mb-1 opacity-75" />
                  <span className="text-xs">Click to browse or drop an image file</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="text-center my-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  — OR VIA URL —
                </div>
              </div>
            )}

            <form onSubmit={modalType === 'image' ? handleImageSubmit : handleEmbedSubmit} className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  {modalType === 'image' ? 'Image Web URL' : 'Website or Article URL'}
                </label>
                <input
                  type="url"
                  required
                  autoFocus
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-sm rounded-md focus:outline-none"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  {modalType === 'image' ? 'Caption (Optional)' : 'Title / Note (Optional)'}
                </label>
                <input
                  type="text"
                  value={inputCaption}
                  onChange={(e) => setInputCaption(e.target.value)}
                  placeholder={modalType === 'image' ? 'Photo by...' : 'Rich website card description'}
                  className="w-full px-3 py-2 text-sm rounded-md focus:outline-none"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-xs font-medium rounded-full hover:opacity-75"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium rounded-full"
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
