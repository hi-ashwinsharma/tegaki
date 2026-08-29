import React from 'react';
import { Feather, ArrowRight, ArrowUpRight } from 'lucide-react';

interface ManifestoFooterProps {
  isAuthenticated: boolean;
  onStartWriting: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenPrivacy: (mode: 'privacy' | 'terms') => void;
}

export const ManifestoFooter: React.FC<ManifestoFooterProps> = ({
  isAuthenticated,
  onStartWriting,
  onOpenAuth,
  onOpenPrivacy,
}) => {
  return (
    <section className="min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-20 py-16 text-center">
      <div className="my-auto space-y-6 max-w-2xl mx-auto">
        <div
          className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-soft)',
            color: 'var(--color-text-primary)',
          }}
        >
          <Feather size={22} strokeWidth={1.6} />
        </div>

        <h2
          className="text-4xl sm:text-6xl font-serif font-bold tracking-tight"
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

        <div className="pt-4">
          <button
            onClick={isAuthenticated ? onStartWriting : () => onOpenAuth('signup')}
            className="px-8 py-4 text-sm font-medium rounded-full inline-flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '1px solid var(--color-text-primary)',
            }}
          >
            <span>Open Your Notebook</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer
        className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none"
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          color: 'var(--color-text-tertiary)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>Tegaki</span>
          <span>•</span>
          <span>Zero gradients. Zero shadows.</span>
          <span>•</span>
          <button onClick={() => onOpenPrivacy('privacy')} className="hover:underline cursor-pointer">
            Privacy
          </button>
          <button onClick={() => onOpenPrivacy('terms')} className="hover:underline cursor-pointer">
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
    </section>
  );
};
