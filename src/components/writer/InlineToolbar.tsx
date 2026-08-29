import React, { useState } from 'react';
import { Bold, Italic, Link2, Heading1, Heading2, Quote, Code, X, Check } from 'lucide-react';

interface InlineToolbarProps {
  position: { top: number; left: number } | null;
  onFormat: (command: string, value?: string) => void;
  onToggleQuote: () => void;
  onToggleInlineCode: () => void;
}

export const InlineToolbar: React.FC<InlineToolbarProps> = ({
  position,
  onFormat,
  onToggleQuote,
  onToggleInlineCode,
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!position) return null;

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl.trim()) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      onFormat('createLink', url);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const clampedLeft = Math.max(140, Math.min(window.innerWidth - 140, position.left));
  const clampedTop = Math.max(60, position.top);

  return (
    <div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3 flex items-center px-1.5 py-1 rounded-lg select-none animate-fade-in max-w-[calc(100vw-24px)] overflow-x-auto"
      style={{
        top: clampedTop - 8,
        left: clampedLeft,
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-soft)',
        color: 'var(--color-text-primary)',
      }}
    >
      {showLinkInput ? (
        <form onSubmit={handleApplyLink} className="flex items-center gap-1 px-2 py-0.5">
          <input
            type="text"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste URL (https://...)"
            className="text-xs bg-transparent focus:outline-none w-48 px-1 py-1"
            style={{ color: 'var(--color-text-primary)' }}
          />
          <button
            type="submit"
            className="p-1 rounded hover:opacity-80 cursor-pointer"
            style={{ color: 'var(--color-accent)' }}
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="p-1 rounded hover:opacity-70 cursor-pointer"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={14} />
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-0.5">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('bold');
            }}
            title="Bold"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Bold size={15} strokeWidth={2} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('italic');
            }}
            title="Italic"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Italic size={15} strokeWidth={2} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setShowLinkInput(true);
            }}
            title="Add Link"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Link2 size={15} strokeWidth={1.8} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('formatBlock', '<h1>');
            }}
            title="Large Heading"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer font-serif font-bold text-xs"
          >
            <Heading1 size={15} strokeWidth={1.8} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('formatBlock', '<h2>');
            }}
            title="Subheading"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Heading2 size={15} strokeWidth={1.8} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onToggleQuote();
            }}
            title="Editorial Quote"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Quote size={15} strokeWidth={1.8} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onToggleInlineCode();
            }}
            title="Inline Code"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Code size={15} strokeWidth={1.8} />
          </button>
        </div>
      )}
    </div>
  );
};
