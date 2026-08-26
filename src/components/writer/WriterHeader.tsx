import React from 'react';
import { ArrowLeft, Lock, Globe, Check } from 'lucide-react';
import { ThemeSelector } from '../common/ThemeSelector';

interface WriterHeaderProps {
  onBack: () => void;
  visibility: 'private' | 'published';
  onToggleVisibility: () => void;
  onOpenPublish: () => void;
  saveStatus: 'saved' | 'saving' | 'dirty';
  isEditingExisting?: boolean;
}

export const WriterHeader: React.FC<WriterHeaderProps> = ({
  onBack,
  visibility,
  onToggleVisibility,
  onOpenPublish,
  saveStatus,
  isEditingExisting,
}) => {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 backdrop-blur-none"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-soft)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          title="Back to all stories"
          className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-serif font-medium hidden sm:inline" style={{ color: 'var(--color-text-primary)' }}>
          Tegaki
        </span>

        <span style={{ color: 'var(--color-text-tertiary)' }} className="hidden sm:inline">•</span>

        {/* Quiet Privacy Toggle */}
        <button
          type="button"
          onClick={onToggleVisibility}
          title="Toggle visibility"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors hover:opacity-85 cursor-pointer font-sans"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-soft)',
            color: visibility === 'private' ? 'var(--color-text-secondary)' : 'var(--color-accent)',
          }}
        >
          {visibility === 'private' ? (
            <>
              <Lock size={12} strokeWidth={1.8} />
              <span>Private Journal</span>
            </>
          ) : (
            <>
              <Globe size={12} strokeWidth={1.8} />
              <span>Public Story</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Subtle Save Status */}
        <div className="flex items-center gap-1 text-xs select-none" style={{ color: 'var(--color-text-tertiary)' }}>
          {saveStatus === 'saved' && (
            <>
              <Check size={13} style={{ color: 'var(--color-accent)' }} />
              <span className="hidden sm:inline text-[11px]">Saved</span>
            </>
          )}
          {saveStatus === 'saving' && (
            <span className="text-[11px] opacity-75">Saving...</span>
          )}
          {saveStatus === 'dirty' && (
            <span className="text-[11px] opacity-60">Unsaved</span>
          )}
        </div>

        <ThemeSelector compact />

        {/* Action Button */}
        <button
          onClick={onOpenPublish}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
          style={{
            backgroundColor: visibility === 'published' ? 'var(--color-accent)' : 'var(--color-text-primary)',
            color: visibility === 'published' ? '#FFFFFF' : 'var(--color-bg)',
            border: `1px solid ${visibility === 'published' ? 'var(--color-accent)' : 'var(--color-text-primary)'}`,
          }}
        >
          <span>{isEditingExisting ? 'Save Changes' : visibility === 'published' ? 'Publish' : 'Save'}</span>
        </button>
      </div>
    </header>
  );
};
