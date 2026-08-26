import React from 'react';
import { CircularLogoIcon, PeacockFeatherIcon, EncryptedLockIcon } from '../common/Icons';
import { ArrowRight, Lock, Globe, Shield } from 'lucide-react';
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
          <CircularLogoIcon size={32} />
          <span className="text-xl font-serif tracking-tight font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Tegaki
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border-soft)' }}>
            手書き
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={onStartWriting}
              className="px-5 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              <PeacockFeatherIcon size={18} active />
              <span>Open Journal</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-sm font-medium px-4 py-2 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-5 py-2 text-sm font-medium rounded-full transition-opacity hover:opacity-90 cursor-pointer"
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
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-secondary)' }}>
            <EncryptedLockIcon size={13} />
            <span>Client-side AES-256 Encrypted Journals • Deliberate Publishing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.1]" style={{ color: 'var(--color-text-primary)' }}>
            Stay curious.<br />
            <span className="italic font-light opacity-90">Write in peace.</span>
          </h1>

          <p className="text-lg sm:text-xl font-serif max-w-xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            A minimalist sanctuary designed after the quiet purity of Medium.com. Keep your deepest thoughts encrypted on your device, or publish stories to the world with custom slugs.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
              className="px-7 py-3 text-base font-medium rounded-full flex items-center gap-3 transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              <span>Start Writing</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onExplorePublic}
              className="px-6 py-3 text-base font-medium rounded-full transition-colors hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              Explore Public Stories
            </button>
          </div>

          {/* Key Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                <Lock size={15} style={{ color: 'var(--color-accent)' }} />
                <span>Zero-Knowledge</span>
              </div>
              <p className="text-xs leading-normal" style={{ color: 'var(--color-text-secondary)' }}>
                Private journals are encrypted in-memory with AES-GCM before saving.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                <Globe size={15} style={{ color: 'var(--color-accent)' }} />
                <span>Custom Slugs</span>
              </div>
              <p className="text-xs leading-normal" style={{ color: 'var(--color-text-secondary)' }}>
                Publish with personalized links like <code className="font-mono text-[11px]">/@user/my-essay</code>.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                <Shield size={15} style={{ color: 'var(--color-accent)' }} />
                <span>Passkey & Google</span>
              </div>
              <p className="text-xs leading-normal" style={{ color: 'var(--color-text-secondary)' }}>
                Instant biometric access with WebAuthn Passkeys or Google auth.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Artistic Bespoke Vector Illustration */}
        <div className="lg:col-span-5 flex justify-center items-center py-6">
          <div
            className="w-full max-w-md p-8 rounded-2xl flex flex-col items-center justify-center relative select-none"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            {/* SVG Illustration: Minimal Calligraphic / Editorial Strokes */}
            <svg
              viewBox="0 0 340 340"
              className="w-full h-auto max-w-[280px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="30" width="220" height="280" rx="4" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
              <rect x="60" y="50" width="220" height="280" rx="4" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
              <rect x="80" y="70" width="220" height="240" rx="4" stroke="currentColor" strokeWidth="1.5" />

              <line x1="110" y1="120" x2="260" y2="120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="110" y1="145" x2="240" y2="145" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="110" y1="170" x2="250" y2="170" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="110" y1="195" x2="210" y2="195" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

              <path
                d="M140 260C170 230 220 180 270 90"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="270" cy="90" r="14" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
              <circle cx="270" cy="90" r="6" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="270" cy="90" r="2" fill="currentColor" />

              <path d="M260 100C245 110 230 115 210 120" stroke="currentColor" strokeWidth="1" strokeDasharray="1 3" />
              <path d="M255 125C240 135 220 145 200 150" stroke="currentColor" strokeWidth="1" strokeDasharray="1 3" />
            </svg>

            <div className="mt-4 text-center">
              <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                Tegaki • Minimalist Editorial
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: '1px solid var(--color-border-soft)', color: 'var(--color-text-tertiary)' }}>
        <div>
          <span>Crafted with zero gradients & zero shadows. 4 adaptive reading themes.</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => onOpenAuth('signin')} className="hover:underline cursor-pointer">Email & Passkey</button>
          <button onClick={onExplorePublic} className="hover:underline cursor-pointer">Explore</button>
          <span className="font-mono">AES-GCM-256</span>
        </div>
      </footer>
    </div>
  );
};
