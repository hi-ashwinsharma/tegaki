import React from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { Feather } from 'lucide-react';

interface HeroHeaderProps {
  isAuthenticated: boolean;
  onStartWriting: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  isAuthenticated,
  onStartWriting,
  onOpenAuth,
}) => {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-12 md:px-20 py-4 backdrop-blur-none"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-soft)',
      }}
    >
      <div className="flex items-center gap-3">
        <CircularLogoIcon size={30} />
        <span
          className="text-xl font-serif tracking-tight font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Tegaki
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSelector compact placement="bottom-right" />

        {isAuthenticated ? (
          <button
            onClick={onStartWriting}
            className="px-5 py-2 text-xs font-medium rounded-full flex items-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '1px solid var(--color-text-primary)',
            }}
          >
            <Feather size={13} strokeWidth={1.8} />
            <span>The Desk</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-xs font-medium px-3 py-1.5 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-1.5 text-xs font-medium rounded-full transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              Open Notebook
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
