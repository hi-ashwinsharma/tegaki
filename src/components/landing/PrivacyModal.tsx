import React from 'react';
import { X, Shield, Lock, EyeOff, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'privacy' | 'terms';
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, mode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-none" onClick={onClose} />

      <div
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto p-8 rounded-2xl z-10 animate-fade-in select-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border-soft)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-md hover:opacity-75 cursor-pointer"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4 text-xs font-mono" style={{ color: 'var(--color-accent)' }}>
          {mode === 'privacy' ? <Shield size={15} /> : <FileText size={15} />}
          <span>{mode === 'privacy' ? 'CONFIDENTIALITY & SECURITY' : 'TERMS OF SERVICE'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {mode === 'privacy' ? 'Privacy Policy' : 'Terms of Thoughtful Use'}
        </h2>

        <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {mode === 'privacy' ? (
            <>
              <p>
                At <strong>Tegaki</strong>, privacy is not a feature or an afterthought—it is the foundational pillar of solitary journaling.
              </p>
              <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)' }}>
                <div className="flex items-center gap-2 font-semibold text-xs" style={{ color: 'var(--color-text-primary)' }}>
                  <Lock size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>1. Client-Side Confidentiality</span>
                </div>
                <p className="text-xs">
                  Your private journals are encrypted in-memory on your device. We do not inspect, monetize, train AI models on, or sell your private drafts.
                </p>
              </div>

              <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)' }}>
                <div className="flex items-center gap-2 font-semibold text-xs" style={{ color: 'var(--color-text-primary)' }}>
                  <EyeOff size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>2. Zero Vanity Tracking</span>
                </div>
                <p className="text-xs">
                  We reject behavioral tracking, pixel trackers, ad-network cookies, and surveillance analytics. Your notebook is your own quiet room.
                </p>
              </div>

              <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)' }}>
                <div className="flex items-center gap-2 font-semibold text-xs" style={{ color: 'var(--color-text-primary)' }}>
                  <Shield size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>3. Deliberate Publication</span>
                </div>
                <p className="text-xs">
                  Only content you explicitly designate as &quot;Public&quot; is visible to readers worldwide under your personalized author slug.
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                Tegaki is designed for people who take writing seriously. By using the platform, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Respect intellectual ownership of all published essays and writings.</li>
                <li>Never publish harmful, abusive, harassing, or deceptive material.</li>
                <li>Engage in dialogue and responses with thoughtful constructiveness.</li>
                <li>Maintain your own passkey and authentication credentials safely.</li>
              </ul>
            </>
          )}
        </div>

        <div className="mt-8 pt-4 flex justify-end" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium rounded-full cursor-pointer"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '1px solid var(--color-text-primary)',
            }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
