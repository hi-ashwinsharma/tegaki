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

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`"${article.title}" by ${article.authorName} on Tegaki\n\n${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
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
          text: article.subtitle ? `"${article.title}" — ${article.subtitle}` : article.title,
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
        className="relative w-full max-w-md p-5 sm:p-6 rounded-xl z-10 animate-fade-in max-h-[90vh] overflow-y-auto"
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

        <h3 className="text-lg sm:text-xl font-serif font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Share this story
        </h3>
        <p className="text-xs mb-4 sm:mb-5" style={{ color: 'var(--color-text-secondary)' }}>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-primary)',
            }}
          >
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.31" />
            </svg>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleXShare}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-primary)',
            }}
          >
            <span className="font-bold text-xs">𝕏</span>
            <span>Post on 𝕏</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Share2 size={13} />
            <span>More</span>
          </button>
        </div>

      </div>
    </div>
  );
};
