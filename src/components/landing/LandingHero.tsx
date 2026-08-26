import React, { useState } from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { PrivacyModal } from './PrivacyModal';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../types/theme';
import { ArrowRight, Lock, Globe, Feather, ArrowUpRight, Check, Bold, Italic, Link2, Quote, Plus } from 'lucide-react';
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
  const { theme, setTheme, themes } = useTheme();
  const [modalState, setModalState] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-neutral-200 dark:selection:bg-neutral-800"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
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

      {/* Main Content Area with Natural Pacing and Scroll */}
      <main className="flex-grow">
        {/* Hero Section: 2-Column Editorial Aesthetic */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
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

          {/* Right Column: Editorial Line-Art Illustration */}
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
        </section>

        {/* Section 1: The Tactile Writer Showcase */}
        <section
          className="py-24 px-6 sm:px-12"
          style={{
            borderTop: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg-subtle)',
          }}
        >
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2
                className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                A clean sheet of paper.
              </h2>
              <p className="text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
                No complex sidebars or distractions. Just words in Newsreader serif typography.
              </p>
            </div>

            {/* Writer Canvas Graphic */}
            <div
              className="rounded-2xl p-6 sm:p-12 select-none relative"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              {/* Writer Header Simulation */}
              <div
                className="flex items-center justify-between pb-4 mb-8 text-xs"
                style={{ borderBottom: '1px solid var(--color-border-soft)' }}
              >
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Check size={13} style={{ color: 'var(--color-accent)' }} />
                  <span>Preserved in silence</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Lock size={11} strokeWidth={1.8} />
                  <span>Private Notebook</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-6 max-w-2xl mx-auto">
                <h3
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  The Solitude of First Thoughts
                </h3>

                <div className="relative">
                  {/* Floating Bubble Toolbar Callout */}
                  <div
                    className="absolute -top-10 left-12 flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <button className="p-1 hover:opacity-75"><Bold size={13} /></button>
                    <button className="p-1 hover:opacity-75"><Italic size={13} /></button>
                    <button className="p-1 hover:opacity-75"><Link2 size={13} /></button>
                    <button className="p-1 hover:opacity-75"><Quote size={13} /></button>
                  </div>

                  <p
                    className="font-editorial text-base sm:text-lg leading-relaxed"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Writing was meant to be an honest dialogue with oneself. The blank page offers freedom without the pressure of an audience watching your first draft.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      border: '1px solid var(--color-border-soft)',
                      backgroundColor: 'var(--color-bg-surface)',
                    }}
                  >
                    <Plus size={13} />
                  </div>
                  <span className="font-editorial italic">Click + to insert images, website cards, or code blocks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Two Spheres (Private vs Public) */}
        <section className="max-w-5xl mx-auto px-6 sm:px-12 py-24 md:py-32 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Two Spheres of Thought
            </h2>
            <p className="text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
              Complete privacy when developing ideas. Total clarity when publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sphere 1: The Private Notebook */}
            <div
              className="p-8 rounded-2xl space-y-5"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-accent)',
                }}
              >
                <Lock size={18} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                The Solitary Notebook
              </h3>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Drafts, journals, and reflections stay encrypted on your device. No metrics, no followers, no public judgment.
              </p>

              <ul className="space-y-2 text-xs pt-2" style={{ color: 'var(--color-text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Client-side AES-256 encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Zero tracking & zero ads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Always available offline</span>
                </li>
              </ul>
            </div>

            {/* Sphere 2: The Public Story */}
            <div
              className="p-8 rounded-2xl space-y-5"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-accent)',
                }}
              >
                <Globe size={18} strokeWidth={1.8} />
              </div>

              <h3 className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                The Published Letter
              </h3>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                When an essay has found its shape, publish with your custom slug. Pure Medium-style reading with claps and marginalia.
              </p>

              <ul className="space-y-2 text-xs pt-2" style={{ color: 'var(--color-text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Personal URL: <code className="font-mono text-[11px]">/@you/slug</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Distraction-free editorial reader</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Thoughtful responses & claps</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Theme Swatches */}
        <section
          className="py-20 px-6 sm:px-12 text-center"
          style={{
            borderTop: '1px solid var(--color-border-soft)',
            borderBottom: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg-subtle)',
          }}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h2
              className="text-2xl sm:text-3xl font-serif font-bold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Four Calibrated Reading Themes
            </h2>
            <p className="text-xs sm:text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
              Zero gradients. Zero shadows. Tuned for eye comfort across day and night.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {themes.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeMode)}
                    className="px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer"
                    style={{
                      backgroundColor: active ? 'var(--color-bg)' : 'var(--color-bg-surface)',
                      border: active ? '1px solid var(--color-text-primary)' : '1px solid var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor: t.previewBg,
                        border: `1px solid ${t.previewBorder}`,
                      }}
                    />
                    <span>{t.name}</span>
                    {active && <Check size={12} style={{ color: 'var(--color-accent)' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Final Quiet Call to Action */}
        <section className="py-24 sm:py-32 px-6 text-center space-y-6">
          <h2
            className="text-3xl sm:text-5xl font-serif font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            The desk is quiet.
          </h2>

          <p
            className="text-base sm:text-lg font-serif max-w-md mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            No feeds. No algorithms. Just you and your thoughts.
          </p>

          <div className="pt-2">
            <button
              onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
              className="px-7 py-3.5 text-sm font-medium rounded-full inline-flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              <span>Open Your Notebook</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer
        className="py-8 px-6 sm:px-12 md:px-20 text-xs select-none"
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          color: 'var(--color-text-tertiary)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>Tegaki</span>
            <span>•</span>
            <span>Zero gradients. Zero shadows.</span>
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
