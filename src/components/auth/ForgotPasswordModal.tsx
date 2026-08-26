import React, { useState } from 'react';
import { X, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await resetPassword(email);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-none"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md p-8 rounded-lg z-10 animate-fade-in"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border-soft)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-md hover:opacity-75"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <CheckCircle2 size={24} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Check your inbox
            </h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              We have sent a secure password reset link to <strong className="font-semibold">{email}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                onBackToLogin();
              }}
              className="w-full py-2.5 text-sm font-medium rounded-full transition-colors"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-text-primary)',
              }}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif font-normal mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
              Reset Password
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Enter your account email to receive recovery instructions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  Email Address
                </label>
                <div
                  className="flex items-center px-3 py-2 rounded-md"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  <Mail size={16} className="mr-2" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm focus:outline-none"
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-sm font-medium rounded-full transition-colors mt-2"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  color: 'var(--color-bg)',
                  border: '1px solid var(--color-text-primary)',
                }}
              >
                {isSubmitting ? 'Sending Instructions...' : 'Send Recovery Link'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs hover:underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Remember your password? Sign in
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
