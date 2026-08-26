import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe } from 'lucide-react';
import type { Article } from '../../types/article';
import { buildArticlePath } from '../../services/slugService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, article }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const urlPath = buildArticlePath(article.authorUsername, article.slug, article.id);
  const fullUrl = `${window.location.origin}${urlPath}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleXShare = () => {
    const text = encodeURIComponent(`"${article.title}" by ${article.authorName} on Tegaki`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.subtitle || article.title,
          url: fullUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-none" onClick={onClose} />

      <div
        className="relative w-full max-w-md p-6 rounded-xl z-10 animate-fade-in"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border-soft)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:opacity-75 cursor-pointer"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-serif font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Share this story
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          Direct link with personalized author slug:
        </p>

        {/* Copy Link Input Bar */}
        <div
          className="flex items-center justify-between p-2 rounded-lg mb-4"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-soft)',
          }}
        >
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <Globe size={15} className="flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
            <span className="text-xs font-mono truncate" style={{ color: 'var(--color-text-primary)' }}>
              {urlPath}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            style={{
              backgroundColor: copied ? 'var(--color-accent)' : 'var(--color-bg-subtle)',
              color: copied ? '#FFFFFF' : 'var(--color-text-primary)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleXShare}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-primary)',
            }}
          >
            <span className="font-bold">𝕏</span>
            <span>Post on X</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Share2 size={14} />
            <span>Share Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
