import React, { useState, useRef } from 'react';
import {
  Lock,
  Globe,
  Check,
  Bold,
  Italic,
  Link2,
  Quote,
  Plus,
} from 'lucide-react';
import { formatSlugInput } from '../../services/slugService';
import { useSelectionToolbar } from '../../hooks/useSelectionToolbar';

export const InteractivePaperSection: React.FC = () => {
  const [interactiveTitle, setInteractiveTitle] = useState('The Solitude of First Thoughts');
  const [interactiveVisibility, setInteractiveVisibility] = useState<'private' | 'published'>('private');
  const [interactiveSlug, setInteractiveSlug] = useState('first-thoughts');
  const [interactiveSaved, setInteractiveSaved] = useState(true);
  const [interactivePlusOpen, setInteractivePlusOpen] = useState(false);
  const [showSlugPreview, setShowSlugPreview] = useState(false);

  const interactiveEditorRef = useRef<HTMLDivElement>(null);
  const { toolbarPosition } = useSelectionToolbar(interactiveEditorRef);

  const handleFormatCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    setInteractiveSaved(false);
    setTimeout(() => setInteractiveSaved(true), 600);
  };

  const handleInsertInteractiveDivider = () => {
    if (interactiveEditorRef.current) {
      interactiveEditorRef.current.focus();
      document.execCommand('insertHTML', false, '<hr class="editorial-divider my-6" /><p><br></p>');
      setInteractivePlusOpen(false);
      setInteractiveSaved(false);
      setTimeout(() => setInteractiveSaved(true), 600);
    }
  };

  const handleInsertInteractiveQuote = () => {
    if (interactiveEditorRef.current) {
      interactiveEditorRef.current.focus();
      document.execCommand(
        'insertHTML',
        false,
        '<blockquote class="editorial-quote">Write your first draft in the dark.</blockquote><p><br></p>'
      );
      setInteractivePlusOpen(false);
      setInteractiveSaved(false);
      setTimeout(() => setInteractiveSaved(true), 600);
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16"
      style={{
        borderTop: '1px solid var(--color-border-soft)',
        backgroundColor: 'var(--color-bg-subtle)',
      }}
    >
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            It all starts with a sheet of paper.
          </h2>
          <p className="text-xs sm:text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
            Try it below: Select text to format, type your thoughts, or click + to add margin notes.
          </p>
        </div>

        {/* Interactive Live Mini-Writer Canvas */}
        <div
          className="rounded-2xl p-6 sm:p-10 select-none relative transition-all"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border-soft)',
          }}
        >
          {/* Floating Selection Toolbar Popup */}
          {toolbarPosition && (
            <div
              className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2 flex items-center px-1.5 py-1 rounded-lg select-none animate-fade-in"
              style={{
                top: toolbarPosition.top - 6,
                left: toolbarPosition.left,
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormatCommand('bold');
                }}
                className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                title="Bold"
              >
                <Bold size={13} strokeWidth={2} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormatCommand('italic');
                }}
                className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                title="Italic"
              >
                <Italic size={13} strokeWidth={2} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  const url = prompt('Enter link URL:');
                  if (url) handleFormatCommand('createLink', url);
                }}
                className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                title="Add Link"
              >
                <Link2 size={13} />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormatCommand('formatBlock', '<blockquote>');
                }}
                className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                title="Quote"
              >
                <Quote size={13} />
              </button>
            </div>
          )}

          {/* Writer Header Simulation */}
          <div
            className="flex items-center justify-between pb-4 mb-6 text-xs"
            style={{ borderBottom: '1px solid var(--color-border-soft)' }}
          >
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
              {interactiveSaved ? (
                <>
                  <Check size={13} style={{ color: 'var(--color-accent)' }} />
                  <span>Preserved in silence</span>
                </>
              ) : (
                <span>Inking draft...</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Privacy Pill Switcher */}
              <div
                className="flex items-center p-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                <button
                  onClick={() => {
                    setInteractiveVisibility('private');
                    setShowSlugPreview(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: interactiveVisibility === 'private' ? 'var(--color-bg)' : 'transparent',
                    color: interactiveVisibility === 'private' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    fontWeight: interactiveVisibility === 'private' ? 600 : 400,
                  }}
                >
                  <Lock size={11} strokeWidth={1.8} />
                  <span>Private</span>
                </button>

                <button
                  onClick={() => {
                    setInteractiveVisibility('published');
                    setShowSlugPreview(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: interactiveVisibility === 'published' ? 'var(--color-bg)' : 'transparent',
                    color: interactiveVisibility === 'published' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    fontWeight: interactiveVisibility === 'published' ? 600 : 400,
                  }}
                >
                  <Globe size={11} strokeWidth={1.8} />
                  <span>Public</span>
                </button>
              </div>

              {interactiveVisibility === 'published' && (
                <button
                  onClick={() => setShowSlugPreview(!showSlugPreview)}
                  className="px-3 py-1 text-[11px] font-medium rounded-full cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#FFFFFF',
                    border: '1px solid var(--color-accent)',
                  }}
                >
                  Slug: /@{interactiveSlug}
                </button>
              )}
            </div>
          </div>

          {/* Custom Slug Drawer Simulation */}
          {showSlugPreview && interactiveVisibility === 'published' && (
            <div
              className="mb-6 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <div className="flex items-center gap-2">
                <Globe size={14} style={{ color: 'var(--color-accent)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Live Publication Route:</span>
                <code className="font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                  /@you/{interactiveSlug}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={interactiveSlug}
                  onChange={(e) => setInteractiveSlug(formatSlugInput(e.target.value))}
                  placeholder="custom-slug"
                  className="px-2 py-1 text-[11px] font-mono rounded bg-transparent focus:outline-none"
                  style={{
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  (Author Defined)
                </span>
              </div>
            </div>
          )}

          {/* Editable Canvas Content */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={interactiveTitle}
              onChange={(e) => {
                setInteractiveTitle(e.target.value);
                setInteractiveSaved(false);
                setTimeout(() => setInteractiveSaved(true), 600);
              }}
              className="w-full bg-transparent font-serif font-bold text-2xl sm:text-4xl tracking-tight focus:outline-none"
              style={{ color: 'var(--color-text-primary)' }}
            />

            <div className="w-full h-px" style={{ backgroundColor: 'var(--color-border-soft)' }} />

            <div
              ref={interactiveEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => {
                setInteractiveSaved(false);
                setTimeout(() => setInteractiveSaved(true), 600);
              }}
              className="editorial-canvas font-editorial text-base sm:text-lg leading-relaxed focus:outline-none min-h-[140px]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Writing is an honest dialogue with oneself. The blank page offers freedom without the pressure of a crowd watching your first draft. Highlight any sentence to format.
            </div>

            {/* Plus Button Simulation */}
            <div className="flex items-center gap-3 pt-2 text-xs select-none">
              <div className="relative">
                <button
                  onClick={() => setInteractivePlusOpen(!interactivePlusOpen)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer"
                  style={{
                    border: '1px solid var(--color-border-soft)',
                    backgroundColor: 'var(--color-bg-surface)',
                    color: 'var(--color-text-secondary)',
                    transform: interactivePlusOpen ? 'rotate(45deg)' : 'none',
                  }}
                >
                  <Plus size={13} strokeWidth={2} />
                </button>

                {interactivePlusOpen && (
                  <div
                    className="absolute left-8 top-0 flex items-center gap-2 p-1.5 rounded-full animate-fade-in z-20"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-soft)',
                    }}
                  >
                    <button
                      onClick={handleInsertInteractiveQuote}
                      className="px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1 hover:opacity-80 cursor-pointer"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <Quote size={11} />
                      <span>Quote</span>
                    </button>
                    <button
                      onClick={handleInsertInteractiveDivider}
                      className="px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1 hover:opacity-80 cursor-pointer"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <span>— Divider</span>
                    </button>
                  </div>
                )}
              </div>

              <span className="font-serif text-xs italic" style={{ color: 'var(--color-text-tertiary)' }}>
                Interactive live sheet • Click into the text above to write
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
