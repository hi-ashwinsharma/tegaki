import React, { useState } from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { PrivacyModal } from './PrivacyModal';
import { ArrowRight, Lock, Feather, ArrowUpRight, ShieldCheck, Mail } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col justify-between selection:bg-neutral-200 dark:selection:bg-neutral-800" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Navbar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-12 md:px-20 py-4 backdrop-blur-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border-soft)',
        }}
      >
        <div className="flex items-center gap-3">
          <CircularLogoIcon size={30} />
          <span className="text-xl font-serif tracking-tight font-bold" style={{ color: 'var(--color-text-primary)' }}>
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
            <div className="flex items-center gap-2">
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
                Open Notebook
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Monster Scrolling Landing Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 sm:px-12 pt-20 pb-28 md:pt-28 md:pb-36 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-secondary)' }}>
            <Lock size={12} strokeWidth={1.8} />
            <span>Private Notebook • Deliberate Publishing</span>
          </div>

          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold tracking-tight leading-[1.05]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            First for yourself. <br />
            <span className="italic font-normal opacity-90">
              Then, if you wish, for the world.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl font-serif max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A notebook stripped of noise. Write privately without metrics, feeds, or audience anxiety. When an idea has matured, release it with quiet dignity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
              className="px-7 py-3.5 text-sm font-medium rounded-full flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              <span>Open Your Notebook</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onExplorePublic}
              className="px-6 py-3.5 text-sm font-medium rounded-full transition-colors hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              Browse Published Works
            </button>
          </div>
        </section>

        {/* Tactile Writer Visual Canvas */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 pb-32">
          <div
            className="rounded-2xl p-6 sm:p-12 select-none relative"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <div className="flex items-center justify-between pb-6 mb-8 text-xs font-mono" style={{ borderBottom: '1px solid var(--color-border-soft)', color: 'var(--color-text-tertiary)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
                <span>TEGAKI NOTEBOOK CANVAS</span>
              </div>
              <span>PRESERVED IN SILENCE</span>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                The Solitude of Thought
              </h2>

              <p className="font-editorial text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                Before there was a feed, there was only the blank page. The sound of rain against glass, the friction of graphite, the freedom to make a mistake without a crowd watching.
              </p>

              <blockquote className="editorial-quote">
                &ldquo;You must write your first draft with your heart in the dark, and rewrite with your head in the light.&rdquo;
              </blockquote>

              <p className="font-editorial text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Tegaki returns you to that quiet room. No like counts, no notifications, no algorithmic performance.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars Bento Grid with Monster Numbers */}
        <section className="max-w-5xl mx-auto px-6 sm:px-12 pb-36 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Principles of the Desk
            </h2>
            <p className="text-sm font-serif leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Engineered with extreme restraint so nothing stands between you and your thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 01 */}
            <div
              className="p-8 sm:p-10 rounded-2xl space-y-4"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <span className="text-4xl sm:text-5xl font-serif font-light opacity-40 block" style={{ color: 'var(--color-text-primary)' }}>
                01
              </span>
              <h3 className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Private by Default
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Your private thoughts stay confidential and encrypted on your device. Only you possess the ability to read or release them.
              </p>
            </div>

            {/* 02 */}
            <div
              className="p-8 sm:p-10 rounded-2xl space-y-4"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <span className="text-4xl sm:text-5xl font-serif font-light opacity-40 block" style={{ color: 'var(--color-text-primary)' }}>
                02
              </span>
              <h3 className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Zero Noise & Zero Metrics
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                No follower counts, no infinite scrolling rage-bait, and no dopamine loops. A pure space designed for writing, not performing.
              </p>
            </div>

            {/* 03 */}
            <div
              className="p-8 sm:p-10 rounded-2xl space-y-4"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <span className="text-4xl sm:text-5xl font-serif font-light opacity-40 block" style={{ color: 'var(--color-text-primary)' }}>
                03
              </span>
              <h3 className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Deliberate Publishing
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                When an idea is polished and ready, release it under your custom author slug, formatted like <code className="text-xs font-mono">/@username/my-essay</code>.
              </p>
            </div>

            {/* 04 */}
            <div
              className="p-8 sm:p-10 rounded-2xl space-y-4"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <span className="text-4xl sm:text-5xl font-serif font-light opacity-40 block" style={{ color: 'var(--color-text-primary)' }}>
                04
              </span>
              <h3 className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Four Tactile Themes
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Pure White, Paper Ivory, Medium Dark, and AMOLED Black. Strictly 0 gradients, 0 box-shadows, and 1px hairline soft borders.
              </p>
            </div>
          </div>
        </section>

        {/* Manifesto Pull-Quote Banner */}
        <section
          className="py-24 px-6 text-center select-none"
          style={{
            borderTop: '1px solid var(--color-border-soft)',
            borderBottom: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg-surface)',
          }}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-serif italic font-normal tracking-tight leading-snug" style={{ color: 'var(--color-text-primary)' }}>
              &ldquo;Write what is true in the quiet. <br />
              Publish when the thought is ready.&rdquo;
            </h2>
            <div className="pt-2">
              <button
                onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
                className="px-6 py-3 text-xs font-medium rounded-full inline-flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  color: 'var(--color-bg)',
                  border: '1px solid var(--color-text-primary)',
                }}
              >
                <span>Begin in Solitude</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Minimalist Footer */}
      <footer
        className="py-16 px-6 sm:px-12 md:px-20 text-xs select-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <CircularLogoIcon size={22} />
              <span className="font-serif font-bold text-sm tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Tegaki
              </span>
            </div>
            <p className="max-w-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
              A minimalist writing platform. Private journals by default, deliberate publications for the world.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="font-semibold block text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
              Platform
            </span>
            <ul className="space-y-1.5">
              <li>
                <button onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')} className="hover:underline cursor-pointer">
                  The Desk
                </button>
              </li>
              <li>
                <button onClick={onExplorePublic} className="hover:underline cursor-pointer">
                  Published Works
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/hi-ashwinsharma/tegaki"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Source Code</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="font-semibold block text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
              Legal & Creator
            </span>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setModalState('privacy')} className="hover:underline cursor-pointer flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => setModalState('terms')} className="hover:underline cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:ashwin@tegaki.io"
                  className="hover:underline inline-flex items-center gap-1 cursor-pointer"
                  style={{ color: 'var(--color-accent)' }}
                >
                  <Mail size={12} />
                  <span>Contact Creator</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
          <div>
            <span>© {new Date().getFullYear()} Tegaki. Zero gradients. Zero shadows. Zero noise.</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Crafted with care by</span>
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
