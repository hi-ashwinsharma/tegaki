import React from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ArrowRight, Lock, Globe, Feather } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LandingHeroProps {
  onStartWriting: () => void;
  onExplorePublic: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartWriting,
  onExplorePublic,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-24 py-8">
      {/* Top minimal header */}
      <header className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
        <div className="flex items-center gap-3">
          <CircularLogoIcon size={30} />
          <span className="text-xl font-serif tracking-tight font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Tegaki
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-serif italic" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border-soft)' }}>
            手書き
          </span>
        </div>

        <div className="flex items-center gap-3">
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
              <Feather size={14} strokeWidth={1.8} />
              <span>Open Journal</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-xs font-medium px-3.5 py-1.5 hover:opacity-80 transition-opacity cursor-pointer"
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
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main hero body */}
      <main className="my-auto py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-secondary)' }}>
            <Lock size={12} strokeWidth={1.8} />
            <span>Private by default. Publish when ready.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.1]" style={{ color: 'var(--color-text-primary)' }}>
            Stay curious.<br />
            <span className="italic font-light opacity-90">Write in peace.</span>
          </h1>

          <p className="text-base sm:text-lg font-serif max-w-xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            A minimalist sanctuary designed after the quiet purity of Medium.com. Keep your journals private and encrypted, or share your craft with custom publication slugs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
              className="px-6 py-2.5 text-sm font-medium rounded-full flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              <span>Start Writing</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onExplorePublic}
              className="px-5 py-2.5 text-sm font-medium rounded-full transition-colors hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              Explore Public Stories
            </button>
          </div>

          {/* Core values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                <Lock size={14} strokeWidth={1.8} style={{ color: 'var(--color-accent)' }} />
                <span>Private & Encrypted</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Your private thoughts stay confidential and encrypted on your device.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                <Globe size={14} strokeWidth={1.8} style={{ color: 'var(--color-accent)' }} />
                <span>Custom Author Slugs</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Publish with clean links like <code className="text-[11px] font-mono">/@username/my-essay</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Minimal vector editorial art */}
        <div className="lg:col-span-5 flex justify-center items-center py-6">
          <div
            className="w-full max-w-sm p-8 rounded-2xl flex flex-col items-center justify-center relative select-none"
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
              <rect x="30" y="30" width="180" height="220" rx="3" opacity="0.4" />
              <rect x="50" y="45" width="180" height="220" rx="3" opacity="0.7" />
              <rect x="70" y="60" width="180" height="200" rx="3" />

              <line x1="95" y1="100" x2="220" y2="100" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="95" y1="125" x2="200" y2="125" strokeLinecap="round" opacity="0.6" />
              <line x1="95" y1="150" x2="210" y2="150" strokeLinecap="round" opacity="0.6" />
              <line x1="95" y1="175" x2="180" y2="175" strokeLinecap="round" opacity="0.6" />

              <path d="M120 230 C150 200, 190 150, 230 70" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="230" cy="70" r="10" strokeWidth="1.2" opacity="0.6" />
              <circle cx="230" cy="70" r="3" fill="currentColor" />
            </svg>

            <div className="mt-4 text-center">
              <span className="text-[11px] uppercase tracking-widest font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                Tegaki • Minimalist Editorial
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: '1px solid var(--color-border-soft)', color: 'var(--color-text-tertiary)' }}>
        <div>
          <span>Zero gradients. Zero shadows. 4 adaptive reading themes.</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => onOpenAuth('signin')} className="hover:underline cursor-pointer">Sign In</button>
          <button onClick={onExplorePublic} className="hover:underline cursor-pointer">Explore</button>
          <span>Tegaki</span>
        </div>
      </footer>
    </div>
  );
};
