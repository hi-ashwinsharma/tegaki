import React from 'react';
import { ArrowLeft, Globe, CheckCircle2 } from 'lucide-react';
import { EncryptedLockIcon, CircularLogoIcon } from '../common/Icons';
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
          title="Back to Dashboard"
          className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <CircularLogoIcon size={22} />
          <span className="text-sm font-serif font-medium hidden sm:inline" style={{ color: 'var(--color-text-primary)' }}>
            Tegaki Writer
          </span>
        </div>

        <span style={{ color: 'var(--color-text-tertiary)' }} className="hidden sm:inline">•</span>

        {/* Privacy Pill Switcher */}
        <button
          type="button"
          onClick={onToggleVisibility}
          title="Click to switch between Private Journal and Public Publication"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-colors hover:opacity-85 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-soft)',
            color: visibility === 'private' ? 'var(--color-text-secondary)' : 'var(--color-accent)',
          }}
        >
          {visibility === 'private' ? (
            <>
              <EncryptedLockIcon size={12} />
              <span>Private (AES-256)</span>
            </>
          ) : (
            <>
              <Globe size={12} />
              <span>Public Draft</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Real-time sync status */}
        <div className="flex items-center gap-1.5 text-xs select-none" style={{ color: 'var(--color-text-tertiary)' }}>
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 size={13} style={{ color: 'var(--color-accent)' }} />
              <span className="hidden sm:inline font-mono text-[11px]">Encrypted & Stored</span>
            </>
          )}
          {saveStatus === 'saving' && (
            <span className="font-mono text-[11px] animate-pulse">Encrypting...</span>
          )}
          {saveStatus === 'dirty' && (
            <span className="font-mono text-[11px]">Unsaved edits</span>
          )}
        </div>

        <ThemeSelector compact />

        {/* Publish / Save Button */}
        <button
          onClick={onOpenPublish}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
          style={{
            backgroundColor: visibility === 'published' ? 'var(--color-accent)' : 'var(--color-text-primary)',
            color: visibility === 'published' ? '#FFFFFF' : 'var(--color-bg)',
            border: `1px solid ${visibility === 'published' ? 'var(--color-accent)' : 'var(--color-text-primary)'}`,
          }}
        >
          <span>{isEditingExisting ? 'Update & Publish' : visibility === 'published' ? 'Publish Story' : 'Save Journal'}</span>
        </button>
      </div>
    </header>
  );
};
