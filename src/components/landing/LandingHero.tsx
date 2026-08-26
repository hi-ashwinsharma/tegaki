import React, { useState } from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { PrivacyModal } from './PrivacyModal';
import { ArrowRight, Lock, Globe, Feather, ArrowUpRight } from 'lucide-react';
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
  const [modalState, setModalState] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-20 py-6 selection:bg-neutral-200 dark:selection:bg-neutral-800"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Top Navbar */}
      <header
        className="flex items-center justify-between py-4"
        style={{ borderBottom: '1px solid var(--color-border-soft)' }}
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
          <ThemeSelector compact />

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

      {/* Main Hero: Pure 2-Column Editorial Aesthetic */}
      <main className="my-auto py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Focused Copy & CTAs */}
        <div className="lg:col-span-7 space-y-7">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Lock size={12} strokeWidth={1.8} />
            <span>Private Notebook • Deliberate Publishing</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight leading-[1.08]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            First for yourself. <br />
            <span className="italic font-normal opacity-90">
              Then, if you wish, for the world.
            </span>
          </h1>

          <p
            className="text-base sm:text-lg font-serif max-w-xl leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A notebook stripped of noise. Write privately without metrics, feeds, or audience anxiety. When an idea has matured, release it with quiet dignity.
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
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

        {/* Right Column: Minimalist Coded Editorial Illustration */}
        <div className="lg:col-span-5 flex justify-center items-center py-4">
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
      </main>

      {/* Minimal Footer */}
      <footer
        className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none"
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          color: 'var(--color-text-tertiary)',
        }}
      >
        <div className="flex items-center gap-4">
          <span>Zero gradients. Zero shadows. Zero noise.</span>
          <span>•</span>
          <button onClick={() => setModalState('privacy')} className="hover:underline cursor-pointer">
            Privacy
          </button>
          <button onClick={() => setModalState('terms')} className="hover:underline cursor-pointer">
            Terms
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:ashwin@tegaki.io"
            className="hover:underline cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Contact
          </a>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span>Crafted by</span>
            <a
              href="https://hi-ashwin.xyz"
              target="_blank"
              rel="noreferrer"
              className="font-medium hover:underline inline-flex items-center gap-0.5"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <span>Ashwin Sharma</span>
              <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </footer>

      {/* Privacy Policy & Terms Modal */}
      <PrivacyModal
        isOpen={modalState !== null}
        onClose={() => setModalState(null)}
        mode={modalState || 'privacy'}
      />
    </div>
  );
};
