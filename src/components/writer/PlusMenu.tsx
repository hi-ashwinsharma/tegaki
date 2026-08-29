import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Link2, Code2, Minus, Upload, X, Loader2, Globe } from 'lucide-react';
import { CODE_LANGUAGES } from '../../utils/codeLanguages';
import { fetchUrlPreview, type UrlPreviewMetadata } from '../../services/embedService';
import { uploadImageFile } from '../../services/imageUploadService';

interface PlusMenuProps {
  top: number;
  isOpen: boolean;
  onToggle: () => void;
  onInsertImage: (url: string, caption?: string) => void;
  onInsertEmbed: (url: string, title?: string, meta?: UrlPreviewMetadata, isVideoPlayer?: boolean) => void;
  onInsertCode: (language?: string, title?: string) => void;
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
  const [modalType, setModalType] = useState<'image' | 'embed' | 'code' | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [inputCaption, setInputCaption] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [inputCodeTitle, setInputCodeTitle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Rich Embed Preview States
  const [previewMeta, setPreviewMeta] = useState<UrlPreviewMetadata | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [asInteractivePlayer, setAsInteractivePlayer] = useState(true);

  // Live URL preview fetch debouncer
  useEffect(() => {
    if (modalType !== 'embed' || !inputUrl.trim() || inputUrl.length < 5) {
      setPreviewMeta(null);
      setIsLoadingPreview(false);
      return;
    }

    let isMounted = true;
    setIsLoadingPreview(true);

    const timer = setTimeout(async () => {
      try {
        const meta = await fetchUrlPreview(inputUrl.trim());
        if (isMounted) {
          setPreviewMeta(meta);
          setIsLoadingPreview(false);
        }
      } catch {
        if (isMounted) {
          setIsLoadingPreview(false);
        }
      }
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [inputUrl, modalType]);

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onInsertImage(inputUrl.trim(), inputCaption.trim());
      resetState();
    }
  };

  const handleEmbedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const finalTitle = inputCaption.trim() || previewMeta?.title;
      onInsertEmbed(inputUrl.trim(), finalTitle, previewMeta || undefined, asInteractivePlayer);
      resetState();
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInsertCode(selectedLanguage, inputCodeTitle.trim());
    resetState();
  };

  const resetState = () => {
    setInputUrl('');
    setInputCaption('');
    setInputCodeTitle('');
    setSelectedLanguage('javascript');
    setPreviewMeta(null);
    setIsLoadingPreview(false);
    setAsInteractivePlayer(true);
    setModalType(null);
    onToggle();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const downloadUrl = await uploadImageFile(file, 'article_images');
        onInsertImage(downloadUrl, inputCaption.trim() || file.name);
        resetState();
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  return (
    <>
      <div
        className="absolute left-[-32px] sm:left-[-44px] md:left-[-48px] z-20 flex items-center transition-all duration-150 select-none"
        style={{ top: top || 0 }}
      >
        {/* The Left-Side Plus (+) Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggle}
          title="Add block"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:opacity-85 cursor-pointer shadow-sm sm:shadow-none"
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
          <div className="flex items-center gap-2 ml-2.5 animate-fade-in bg-surface/90 sm:bg-transparent p-1 sm:p-0 rounded-full">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
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
              onMouseDown={(e) => e.preventDefault()}
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
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setModalType('code')}
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
              onMouseDown={(e) => e.preventDefault()}
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

      {/* Modal Dialog for Embeds / Images / Code */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md p-6 rounded-2xl shadow-xl flex flex-col gap-4 border"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border-soft)',
              color: 'var(--color-text-primary)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg">
                {modalType === 'image' && 'Add Image'}
                {modalType === 'embed' && 'Embed Website or Video'}
                {modalType === 'code' && 'Insert Code Block'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 rounded-full hover:opacity-75 cursor-pointer"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            {modalType === 'code' ? (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Choose Programming Language
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
                    {CODE_LANGUAGES.map((lang) => (
                      <button
                        type="button"
                        key={lang.value}
                        onClick={() => setSelectedLanguage(lang.value)}
                        className="px-2.5 py-1.5 text-xs font-mono rounded text-left transition-all cursor-pointer truncate"
                        style={{
                          backgroundColor:
                            selectedLanguage === lang.value
                              ? 'var(--color-accent)'
                              : 'var(--color-bg-surface)',
                          color:
                            selectedLanguage === lang.value
                              ? '#FFFFFF'
                              : 'var(--color-text-secondary)',
                          border:
                            selectedLanguage === lang.value
                              ? '1px solid var(--color-accent)'
                              : '1px solid var(--color-border-soft)',
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md focus:outline-none font-mono cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {CODE_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Filename / Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={inputCodeTitle}
                    onChange={(e) => setInputCodeTitle(e.target.value)}
                    placeholder="e.g. index.ts, main.py, styles.css"
                    className="w-full px-3 py-2 text-xs rounded-md focus:outline-none font-mono"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>

                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  You can change the title and language anytime directly in the code block header.
                </p>

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
                    Insert Code Block
                  </button>
                </div>
              </form>
            ) : modalType === 'embed' ? (
              <form onSubmit={handleEmbedSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Web Link or Video URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      autoFocus
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://github.com, https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2.5 text-xs rounded-md focus:outline-none pr-8"
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-soft)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    {isLoadingPreview && (
                      <Loader2
                        size={14}
                        className="animate-spin absolute right-2.5 top-3"
                        style={{ color: 'var(--color-accent)' }}
                      />
                    )}
                  </div>
                </div>

                {/* Live Rich Embed Preview Box */}
                {previewMeta && (
                  <div
                    className="p-3.5 rounded-xl border flex flex-col gap-2.5 animate-fade-in"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderColor: 'var(--color-border-soft)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {previewMeta.logo ? (
                        <img
                          src={previewMeta.logo}
                          alt=""
                          className="w-4 h-4 rounded-sm object-contain"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <Globe size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                      )}
                      <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                        {previewMeta.domain}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-serif font-bold line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                          {previewMeta.title}
                        </h4>
                        {previewMeta.description && (
                          <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                            {previewMeta.description}
                          </p>
                        )}
                      </div>
                      {previewMeta.image && (
                        <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 bg-black/10">
                          <img src={previewMeta.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Video Player Option for YouTube / Vimeo */}
                    {previewMeta.isVideo && (
                      <div className="flex items-center justify-between pt-1 border-t border-border-soft text-[11px]">
                        <span style={{ color: 'var(--color-text-secondary)' }}>Embed Format:</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setAsInteractivePlayer(true)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                            style={{
                              backgroundColor: asInteractivePlayer ? 'var(--color-accent)' : 'transparent',
                              color: asInteractivePlayer ? '#FFF' : 'var(--color-text-secondary)',
                            }}
                          >
                            Video Player
                          </button>
                          <button
                            type="button"
                            onClick={() => setAsInteractivePlayer(false)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                            style={{
                              backgroundColor: !asInteractivePlayer ? 'var(--color-accent)' : 'transparent',
                              color: !asInteractivePlayer ? '#FFF' : 'var(--color-text-secondary)',
                            }}
                          >
                            Web Card
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Custom Title (Optional override)
                  </label>
                  <input
                    type="text"
                    value={inputCaption}
                    onChange={(e) => setInputCaption(e.target.value)}
                    placeholder="Leave empty to use automatic webpage title"
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
                    Insert Embed
                  </button>
                </div>
              </form>
            ) : (
              /* Image Upload / URL Modal */
              <form onSubmit={handleImageSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Image Web URL
                  </label>
                  <input
                    type="url"
                    required
                    autoFocus
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 text-xs rounded-md focus:outline-none"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Or Upload File from Device
                  </label>
                  <label
                    className="w-full py-3 px-4 rounded-xl border border-dashed flex items-center justify-center gap-2 cursor-pointer hover:opacity-85 transition-opacity text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderColor: 'var(--color-border-hover)',
                      color: 'var(--color-accent)',
                      opacity: isUploadingImage ? 0.7 : 1,
                    }}
                  >
                    {isUploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{isUploadingImage ? 'Uploading Image...' : 'Choose Image File'}</span>
                    <input type="file" accept="image/*" disabled={isUploadingImage} onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={inputCaption}
                    onChange={(e) => setInputCaption(e.target.value)}
                    placeholder="Image caption..."
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
                    Insert Image
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
