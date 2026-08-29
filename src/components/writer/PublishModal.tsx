import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, Lock, Check, Upload, Image as ImageIcon, Trash2, Link2, ShieldCheck } from 'lucide-react';
import { generateSlug, sanitizeSlug, formatSlugInput } from '../../services/slugService';

const POPULAR_TAGS = ['Writing', 'Notes', 'Technology', 'Philosophy', 'Design', 'Personal', 'Ideas', 'Engineering'];

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content?: string;
  initialSlug?: string;
  initialVisibility?: 'private' | 'published';
  initialTags?: string[];
  initialCoverImage?: string;
  onConfirmPublish: (params: {
    title: string;
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle: string;
    coverImage?: string;
  }) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = '',
  content = '',
  initialSlug = '',
  initialVisibility = 'published',
  initialTags = [],
  initialCoverImage = '',
  onConfirmPublish,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'published'>('published');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Extract any images already embedded in the story content
  const inArticleImages = useMemo(() => {
    if (!content) return [];
    const matches: string[] = [];
    const regex = /<img[^>]+src="([^">]+)"/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1] && !matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches.slice(0, 4);
  }, [content]);

  useEffect(() => {
    if (isOpen) {
      setCustomTitle(title || '');
      setSlug(initialSlug || generateSlug(title || 'journal'));
      setCustomSubtitle(subtitle || '');
      setVisibility(initialVisibility);
      setTags(initialTags.length ? initialTags : ['Writing', 'Notes']);
      setCoverImage(initialCoverImage || '');
      setShowUrlInput(false);
      setImageUrlInput('');
    }
  }, [isOpen, title, subtitle, initialSlug, initialVisibility, initialTags, initialCoverImage]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, '');
      if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleTogglePopularTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64 = loadEvt.target?.result as string;
        setCoverImage(base64);
        setShowUrlInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setCoverImage(imageUrlInput.trim());
      setImageUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedTitle = customTitle.trim() || title.trim() || 'Untitled Thought';
    onConfirmPublish({
      title: resolvedTitle,
      slug: sanitizeSlug(slug) || generateSlug(resolvedTitle),
      visibility,
      tags,
      subtitle: customSubtitle,
      coverImage: coverImage.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl p-6 sm:p-8 rounded-2xl z-10 animate-fade-in max-h-[92vh] overflow-y-auto shadow-2xl border flex flex-col gap-6"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border-soft)',
          color: 'var(--color-text-primary)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border-soft">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              {visibility === 'published' ? 'Story Preview & Publishing' : 'Preserve Private Journal'}
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {visibility === 'published'
                ? 'Review your public preview, set a cover image, and refine title & metadata before publishing.'
                : 'Configure encrypted preservation settings for your private journal archive.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:opacity-75 cursor-pointer flex-shrink-0 transition-opacity"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* LEFT COLUMN: Story Card Preview & Cover Image */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <label className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                Live Card Preview & Cover
              </label>

              {/* Card Preview Box */}
              <div
                className="rounded-xl overflow-hidden border shadow-sm flex flex-col transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderColor: 'var(--color-border-soft)',
                }}
              >
                {/* Cover Image Area */}
                {coverImage ? (
                  <div className="relative aspect-[16/9] w-full bg-black/5 overflow-hidden group">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <label className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-black hover:opacity-90 cursor-pointer shadow">
                        Replace
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="aspect-[16/9] w-full border-b border-dashed flex flex-col items-center justify-center p-4 text-center gap-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--color-bg-subtle)',
                      borderColor: 'var(--color-border-soft)',
                    }}
                  >
                    <ImageIcon size={28} style={{ color: 'var(--color-text-tertiary)' }} strokeWidth={1.5} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        No cover image set
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        Auto-generates branded editorial card
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Text Preview */}
                <div className="p-4 flex flex-col gap-1.5">
                  <h4 className="font-serif font-bold text-sm sm:text-base line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                    {customTitle.trim() || title.trim() || 'Untitled Thought'}
                  </h4>
                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {customSubtitle.trim() || 'No subtitle provided. Readers will see your opening lines here...'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-soft text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    <span className="font-mono">/{sanitizeSlug(slug) || 'story'}</span>
                    <span>•</span>
                    <span className="capitalize">{visibility}</span>
                  </div>
                </div>
              </div>

              {/* Cover Image Action Controls */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    className="flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-opacity hover:opacity-85"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderColor: 'var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <Upload size={13} />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="py-2 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-85"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderColor: 'var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <Link2 size={13} />
                    <span>URL</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="flex items-center gap-1.5 pt-1 animate-fade-in">
                    <input
                      type="url"
                      autoFocus
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste Image URL (https://...)"
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-md focus:outline-none"
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-soft)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyImageUrl}
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-accent text-white hover:opacity-90 cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                )}

                {/* In-Article Image Quick Pickers */}
                {inArticleImages.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-[11px] mb-1.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                      Or pick image from your story:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {inArticleImages.map((imgSrc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCoverImage(imgSrc)}
                          title="Use this image as cover"
                          className="w-14 h-10 rounded-md overflow-hidden border flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
                          style={{
                            borderColor: coverImage === imgSrc ? 'var(--color-accent)' : 'var(--color-border-soft)',
                            boxShadow: coverImage === imgSrc ? '0 0 0 2px var(--color-accent)' : 'none',
                          }}
                        >
                          <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Publishing, Visibility & Metadata Settings */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {/* Visibility Choice */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider mb-2 font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                  Publication Visibility
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVisibility('published')}
                    className="p-3 rounded-xl flex flex-col items-start text-left transition-all cursor-pointer"
                    style={{
                      backgroundColor: visibility === 'published' ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
                      border: visibility === 'published' ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border-soft)',
                    }}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        <Globe size={14} style={{ color: 'var(--color-accent)' }} />
                        <span>Public Story</span>
                      </div>
                      {visibility === 'published' && <Check size={13} style={{ color: 'var(--color-accent)' }} />}
                    </div>
                    <span className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      Published with custom URL slug, live community discovery, and claps.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className="p-3 rounded-xl flex flex-col items-start text-left transition-all cursor-pointer"
                    style={{
                      backgroundColor: visibility === 'private' ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
                      border: visibility === 'private' ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border-soft)',
                    }}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        <ShieldCheck size={14} style={{ color: 'var(--color-accent)' }} />
                        <span>Private Journal</span>
                      </div>
                      {visibility === 'private' && <Check size={13} style={{ color: 'var(--color-accent)' }} />}
                    </div>
                    <span className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      Encrypted client-side and saved exclusively for your private archive.
                    </span>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider mb-1.5 font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                  Story Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter story title..."
                  className="w-full px-3.5 py-2 text-sm font-serif font-bold rounded-xl focus:outline-none"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {/* Custom Slug / URL with simplified [ 🌐 / ] prefix */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                    Story Slug
                  </label>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-accent)' }}>
                    /{sanitizeSlug(slug) || '...'}
                  </span>
                </div>

                <div
                  className="flex items-center px-3 py-2 rounded-xl gap-1.5"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  <div className="flex items-center gap-1 text-xs font-mono select-none px-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Globe size={13} className="flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                    <span>/</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(formatSlugInput(e.target.value))}
                    placeholder="story-slug"
                    className="w-full bg-transparent text-xs font-mono focus:outline-none"
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                </div>
              </div>

              {/* Subtitle / Summary */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider mb-1.5 font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                  Subtitle / Story Hook
                </label>
                <textarea
                  rows={2}
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="A concise summary or thought hook for readers..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl focus:outline-none resize-none leading-relaxed"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {/* Topic Tags */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                    Topic Tags (up to 5)
                  </label>
                  <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {tags.length}/5
                  </span>
                </div>

                <div
                  className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl min-h-[38px]"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs rounded-full flex items-center gap-1 font-medium transition-all"
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
                        className="hover:opacity-75 cursor-pointer ml-0.5"
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
                    placeholder={tags.length < 5 ? 'Add tag (press Enter)...' : ''}
                    disabled={tags.length >= 5}
                    className="bg-transparent text-xs focus:outline-none flex-grow min-w-[100px] px-1 py-0.5"
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                </div>

                {/* Popular Tag Suggestions */}
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  <span className="text-[10px] mr-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    Suggested:
                  </span>
                  {POPULAR_TAGS.map((popTag) => (
                    <button
                      type="button"
                      key={popTag}
                      onClick={() => handleTogglePopularTag(popTag)}
                      className="text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer"
                      style={{
                        backgroundColor: tags.includes(popTag) ? 'var(--color-accent)' : 'var(--color-bg-surface)',
                        borderColor: tags.includes(popTag) ? 'var(--color-accent)' : 'var(--color-border-soft)',
                        color: tags.includes(popTag) ? '#FFFFFF' : 'var(--color-text-secondary)',
                      }}
                    >
                      {popTag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className="flex items-center justify-end gap-3 pt-4 border-t"
            style={{ borderColor: 'var(--color-border-soft)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-medium rounded-full hover:opacity-75 cursor-pointer transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold rounded-full flex items-center gap-2 transition-all hover:opacity-90 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
                border: '1px solid var(--color-accent)',
              }}
            >
              {visibility === 'published' ? (
                <>
                  <Globe size={14} />
                  <span>Publish Story</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Preserve Journal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
