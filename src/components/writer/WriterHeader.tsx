import React from 'react';
import { ArrowLeft, Lock, Globe, Check } from 'lucide-react';
import { ThemeSelector } from '../common/ThemeSelector';

interface WriterHeaderProps {
  onBack: () => void;
  onPublishClick: () => void;
  onSaveJournal: () => void;
  isSaving: boolean;
  visibility: 'private' | 'published';
  onToggleVisibility: (v: 'private' | 'published') => void;
  hasUnsavedChanges: boolean;
  wordCount: number;
}

export const WriterHeader: React.FC<WriterHeaderProps> = ({
  onBack,
  onPublishClick,
  onSaveJournal,
  isSaving,
  visibility,
  onToggleVisibility,
  hasUnsavedChanges,
  wordCount,
}) => {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-12 py-2.5 sm:py-3.5 backdrop-blur-none select-none"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-soft)',
      }}
    >
      {/* Left Back and Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onBack}
          title="Return to the desk"
          className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer flex-shrink-0"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Quiet Save Status */}
        <div className="flex items-center gap-1.5 text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
          {isSaving ? (
            <span>Inking...</span>
          ) : hasUnsavedChanges ? (
            <span className="text-[11px] sm:text-xs">Unsaved</span>
          ) : (
            <span className="flex items-center gap-1">
              <Check size={13} style={{ color: 'var(--color-accent)' }} />
              <span className="hidden sm:inline">Preserved</span>
            </span>
          )}
        </div>

        {/* Word Count */}
        <span className="text-xs hidden md:inline" style={{ color: 'var(--color-text-tertiary)' }}>
          • {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Privacy Selector Pill */}
        <div
          className="flex items-center p-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-soft)',
          }}
        >
          <button
            onClick={() => onToggleVisibility('private')}
            title="Private Notebook: Kept confidential and encrypted"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: visibility === 'private' ? 'var(--color-bg)' : 'transparent',
              color: visibility === 'private' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontWeight: visibility === 'private' ? 600 : 400,
            }}
          >
            <Lock size={12} strokeWidth={1.8} />
            <span className="hidden sm:inline">Private</span>
          </button>

          <button
            onClick={() => onToggleVisibility('published')}
            title="Public Story: Released with your custom slug"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: visibility === 'published' ? 'var(--color-bg)' : 'transparent',
              color: visibility === 'published' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontWeight: visibility === 'published' ? 600 : 400,
            }}
          >
            <Globe size={12} strokeWidth={1.8} />
            <span className="hidden sm:inline">Public</span>
          </button>
        </div>

        <ThemeSelector compact />

        {visibility === 'published' ? (
          <button
            onClick={onPublishClick}
            className="px-3.5 sm:px-4 py-1.5 text-xs font-medium rounded-full transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
              border: '1px solid var(--color-accent)',
            }}
          >
            Release
          </button>
        ) : (
          <button
            onClick={onSaveJournal}
            className="px-3.5 sm:px-4 py-1.5 text-xs font-medium rounded-full transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '1px solid var(--color-text-primary)',
            }}
          >
            Preserve
          </button>
        )}
      </div>
    </header>
  );
};
