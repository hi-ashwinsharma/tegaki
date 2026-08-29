import React, { useState } from 'react';
import {
  Lock,
  Globe,
  BellOff,
  Zap,
  Flame,
  MessageSquare,
  Share2,
} from 'lucide-react';

export const TwoSpheresSection: React.FC = () => {
  const [activeSphere, setActiveSphere] = useState<'private' | 'public'>('private');

  return (
    <section className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-10">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Two Spheres of Thought
        </h2>
        <p className="text-xs sm:text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
          Switch the lens below to explore how a thought evolves from private intimacy to public craft.
        </p>

        {/* Interactive Lens Switcher */}
        <div
          className="inline-flex items-center p-1 rounded-full mt-2"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-soft)',
          }}
        >
          <button
            onClick={() => setActiveSphere('private')}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: activeSphere === 'private' ? 'var(--color-bg)' : 'transparent',
              color: activeSphere === 'private' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontWeight: activeSphere === 'private' ? 600 : 400,
              border: activeSphere === 'private' ? '1px solid var(--color-border-soft)' : '1px solid transparent',
            }}
          >
            <Lock size={13} strokeWidth={1.8} />
            <span>The Solitary Notebook</span>
          </button>

          <button
            onClick={() => setActiveSphere('public')}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: activeSphere === 'public' ? 'var(--color-bg)' : 'transparent',
              color: activeSphere === 'public' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontWeight: activeSphere === 'public' ? 600 : 400,
              border: activeSphere === 'public' ? '1px solid var(--color-border-soft)' : '1px solid transparent',
            }}
          >
            <Globe size={13} strokeWidth={1.8} />
            <span>The Published Letter</span>
          </button>
        </div>
      </div>

      {/* Dynamic Sphere Showcase Container */}
      <div
        className="rounded-2xl p-8 sm:p-12 transition-all duration-300 relative select-none"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-soft)',
        }}
      >
        {activeSphere === 'private' ? (
          /* Private Notebook View */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--color-accent)' }}>
                <Lock size={14} />
                <span>INTIMATE • ENCRYPTED • SOLITARY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Raw thoughts, safe from judgment.
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                A journal where you never have to perform. Encrypted in-memory on your device with AES-256 before saving to Cloud Firestore. Zero metrics. Zero algorithms.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className="px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-soft)' }}>
                  <Lock size={12} />
                  <span>Zero-Knowledge Storage</span>
                </span>
                <span className="px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-soft)' }}>
                  <BellOff size={12} />
                  <span>No Follower Counts</span>
                </span>
                <span className="px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-soft)' }}>
                  <Zap size={12} />
                  <span>Offline Capable</span>
                </span>
              </div>
            </div>

            <div
              className="md:col-span-6 p-6 rounded-xl space-y-3 font-mono text-xs"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
                <span className="font-bold text-xs" style={{ color: 'var(--color-text-primary)' }}>notebook_entry_042.enc</span>
                <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>Confidential</span>
              </div>
              <p className="font-editorial text-sm italic" style={{ color: 'var(--color-text-primary)' }}>
                &ldquo;I woke up with the realization that we measure ourselves against ghosts of other people&apos;s finished work, forgetting how crude their first attempts were...&rdquo;
              </p>
              <div className="text-[11px] pt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                • Stored securely for your eyes only
              </div>
            </div>
          </div>
        ) : (
          /* Published Letter View */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--color-accent)' }}>
                <Globe size={14} />
                <span>PUBLIC RELEASE • AUTHOR SLUG</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Released with craft and dignity.
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                When your piece is ready, assign a custom slug and share it with readers. Distraction-free editorial typography, applause claps, and quiet margin responses.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className="px-3 py-1 rounded-full font-mono flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-soft)' }}>
                  <Globe size={12} />
                  <span>/@your-name/essay-slug</span>
                </span>
                <span className="px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-soft)' }}>
                  <Flame size={12} />
                  <span>Resonated Claps</span>
                </span>
                <span className="px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-soft)' }}>
                  <MessageSquare size={12} />
                  <span>Margin Responses</span>
                </span>
              </div>
            </div>

            <div
              className="md:col-span-6 p-6 rounded-xl space-y-3"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <div className="flex items-center justify-between text-xs pb-2" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
                <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>/@ashwin/the-art-of-quiet-thought</span>
                <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>3 min read</span>
              </div>
              <h4 className="font-serif font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                The Art of Quiet Thought
              </h4>
              <p className="font-editorial text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                In an internet built on instant reaction, there is immense power in taking two weeks to think before writing a single word.
              </p>
              <div className="flex items-center justify-between pt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono" style={{ color: 'var(--color-text-primary)' }}>
                    <Flame size={13} /> 148 claps
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={13} /> 12 responses
                  </span>
                </div>
                <Share2 size={13} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
