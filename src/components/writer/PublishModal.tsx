import React, { useState, useEffect } from 'react';
import { X, Globe, Lock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateSlug, sanitizeSlug } from '../../services/slugService';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  initialSlug?: string;
  initialVisibility?: 'private' | 'published';
  initialTags?: string[];
  onConfirmPublish: (params: {
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle: string;
  }) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  initialSlug = '',
  initialVisibility = 'published',
  initialTags = [],
  onConfirmPublish,
}) => {
  const { user } = useAuth();
  const [slug, setSlug] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'published'>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSlug(initialSlug || generateSlug(title || 'my-story'));
      setCustomSubtitle(subtitle || '');
      setVisibility(initialVisibility);
      setTags(initialTags.length ? initialTags : ['Writing', 'Thoughts']);
    }
  }, [isOpen, title, subtitle, initialSlug, initialVisibility, initialTags]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, '');
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPublish({
      slug: sanitizeSlug(slug) || generateSlug(title || 'story'),
      visibility,
      tags,
      subtitle: customSubtitle,
    });
    onClose();
  };

  const currentUsername = user?.username || 'writer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-none" onClick={onClose} />

      <div
        className="relative w-full max-w-lg p-8 rounded-xl z-10 animate-fade-in"
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
          <X size={18} />
        </button>

        <h2 className="text-2xl font-serif font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {visibility === 'published' ? 'Story Preview & Publishing' : 'Private Encrypted Journal'}
        </h2>
        <p className="text-xs mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Review how your work appears and customize its unique link.
        </p>

        <form onSubmit={handleConfirm} className="space-y-5">
          {/* Visibility Mode Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              Publication Privacy Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility('published')}
                className="p-3 rounded-lg flex flex-col items-start text-left transition-colors cursor-pointer"
                style={{
                  backgroundColor: visibility === 'published' ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
                  border: visibility === 'published' ? '1px solid var(--color-accent)' : '1px solid var(--color-border-soft)',
                }}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  <Globe size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Public Publication</span>
                </div>
                <span className="text-[11px] leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
                  Accessible to readers worldwide with upvotes and comments.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                className="p-3 rounded-lg flex flex-col items-start text-left transition-colors cursor-pointer"
                style={{
                  backgroundColor: visibility === 'private' ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
                  border: visibility === 'private' ? '1px solid var(--color-accent)' : '1px solid var(--color-border-soft)',
                }}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  <Lock size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Private Journal</span>
                </div>
                <span className="text-[11px] leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
                  Stored encrypted on device with AES-GCM 256-bit.
                </span>
              </button>
            </div>
          </div>

          {/* Custom Slug Configuration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                Custom Link / URL Slug
              </label>
              <span className="text-[11px] font-mono" style={{ color: 'var(--color-accent)' }}>
                /@{currentUsername}/{sanitizeSlug(slug) || '...'}
              </span>
            </div>

            <div
              className="flex items-center px-3 py-2 rounded-md"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <span className="text-xs font-mono select-none mr-1" style={{ color: 'var(--color-text-tertiary)' }}>
                /@{currentUsername}/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                placeholder="your-custom-slug"
                className="w-full bg-transparent text-xs font-mono focus:outline-none"
                style={{ color: 'var(--color-text-primary)' }}
              />
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Use lowercase letters, numbers, and hyphens. You have full control over the slug.
            </p>
          </div>

          {/* Subtitle / Teaser */}
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              Short Preview Note / Subtitle
            </label>
            <input
              type="text"
              value={customSubtitle}
              onChange={(e) => setCustomSubtitle(e.target.value)}
              placeholder="A one-sentence summary for readers..."
              className="w-full px-3 py-2 text-xs rounded-md focus:outline-none"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              Topics / Tags (up to 5)
            </label>
            <div
              className="flex flex-wrap items-center gap-1.5 p-2 rounded-md"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-xs rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length < 5 ? 'Add a topic and hit enter...' : ''}
                disabled={tags.length >= 5}
                className="bg-transparent text-xs focus:outline-none flex-grow min-w-[120px]"
                style={{ color: 'var(--color-text-primary)' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-full hover:opacity-75 cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 text-xs font-medium rounded-full flex items-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
                border: '1px solid var(--color-accent)',
              }}
            >
              <Check size={14} />
              <span>{visibility === 'published' ? 'Publish Now' : 'Save Encrypted Journal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
