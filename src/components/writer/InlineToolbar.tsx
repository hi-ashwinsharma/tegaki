import React, { useState } from 'react';
import { Bold, Italic, Link as LinkIcon, Heading1, Heading2, Quote, Code } from 'lucide-react';

interface InlineToolbarProps {
  position: { top: number; left: number } | null;
  onFormat: (command: string, value?: string) => void;
  onToggleQuote: () => void;
}

export const InlineToolbar: React.FC<InlineToolbarProps> = ({
  position,
  onFormat,
  onToggleQuote,
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!position) return null;

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      onFormat('createLink', linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  return (
    <div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2 flex items-center px-1 py-1 rounded-lg select-none animate-fade-in"
      style={{
        top: position.top - 10,
        left: position.left,
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
            placeholder="Paste or type a link (https://...)"
            className="text-xs bg-transparent focus:outline-none w-48 px-1 py-1"
            style={{ color: 'var(--color-text-primary)' }}
          />
          <button
            type="submit"
            className="text-xs px-2 py-1 rounded font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="text-xs px-1.5 py-1 hover:opacity-75"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            ✕
          </button>
        </form>
      ) : (
        <div className="flex items-center divide-x divide-transparent">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('bold');
            }}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Bold size={15} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('italic');
            }}
            title="Italic (Ctrl+I)"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Italic size={15} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setShowLinkInput(true);
            }}
            title="Hyperlink"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <LinkIcon size={15} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('formatBlock', '<h2>');
            }}
            title="Title Heading (H1)"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-serif font-bold text-xs"
          >
            <Heading1 size={15} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('formatBlock', '<h3>');
            }}
            title="Subtitle Heading (H2)"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Heading2 size={15} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onToggleQuote();
            }}
            title="Editorial Quote with Background"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Quote size={15} />
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormat('formatBlock', '<pre>');
            }}
            title="Code snippet"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Code size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
