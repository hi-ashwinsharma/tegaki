import React from 'react';
import { ArrowRight, Lock, Globe } from 'lucide-react';

interface HeroMainSectionProps {
  isAuthenticated: boolean;
  onStartWriting: () => void;
  onExplorePublic: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const HeroMainSection: React.FC<HeroMainSectionProps> = ({
  isAuthenticated,
  onStartWriting,
  onExplorePublic,
  onOpenAuth,
}) => {
  return (
    <section className="min-h-[calc(100vh-65px)] flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[82px] font-serif font-bold tracking-tight leading-[1.06]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span className="inline-block whitespace-normal sm:whitespace-nowrap">
              First for yourself.
            </span>
            <br />
            <span className="inline-block italic font-normal opacity-90 whitespace-normal sm:whitespace-nowrap">
              Then, for the world.
            </span>
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl font-serif max-w-2xl leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Tegaki is a quiet sanctuary for unhurried thought. A notebook without algorithms, metrics, or premature audience anxiety—where ideas mature in private before entering the world.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
              className="px-6 py-3 text-xs sm:text-sm font-medium rounded-full flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              <span>Open Your Notebook</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onExplorePublic}
              className="px-5 py-3 text-xs sm:text-sm font-medium rounded-full transition-colors hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              Browse Published Works
            </button>
          </div>

          {/* 2 Subtle Value Badges */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 max-w-2xl"
            style={{ borderTop: '1px solid var(--color-border-soft)' }}
          >
            <div className="space-y-1">
              <div
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <Lock size={13} strokeWidth={1.8} style={{ color: 'var(--color-accent)' }} />
                <span>Private & Confidential</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Your private thoughts stay confidential and encrypted on your device.
              </p>
            </div>

            <div className="space-y-1">
              <div
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <Globe size={13} strokeWidth={1.8} style={{ color: 'var(--color-accent)' }} />
                <span>Custom Author Slugs</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Publish with clean links like <code className="text-[11px] font-mono">/@username/my-essay</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Line-Art Illustration */}
        <div className="lg:col-span-4 flex justify-center items-center py-4">
          <div
            className="w-full max-w-sm p-8 sm:p-10 rounded-2xl flex flex-col items-center justify-center relative select-none"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <svg
              viewBox="0 0 280 280"
              className="w-full h-auto max-w-[240px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="30" y="30" width="180" height="220" rx="3" opacity="0.3" />
              <rect x="50" y="45" width="180" height="220" rx="3" opacity="0.6" />
              <rect x="70" y="60" width="180" height="200" rx="3" />

              <line x1="95" y1="100" x2="220" y2="100" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="95" y1="125" x2="200" y2="125" strokeLinecap="round" opacity="0.6" />
              <line x1="95" y1="150" x2="210" y2="150" strokeLinecap="round" opacity="0.6" />
              <line x1="95" y1="175" x2="180" y2="175" strokeLinecap="round" opacity="0.6" />

              <path d="M120 230 C150 200, 190 150, 230 70" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="230" cy="70" r="10" strokeWidth="1.2" opacity="0.6" />
              <circle cx="230" cy="70" r="3" fill="currentColor" />
            </svg>

            <div className="mt-5 text-center">
              <span
                className="text-[11px] uppercase tracking-widest font-mono"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Tegaki • Quiet Writing Desk
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
