import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PasskeyIcon } from '../common/Icons';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { loginWithGoogle, loginWithPasskey, loginWithEmail, registerWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'quick' | 'email'>('quick');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    onClose();
  };

  const handlePasskey = async () => {
    setLoading(true);
    await loginWithPasskey();
    setLoading(false);
    onClose();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'signup') {
      await registerWithEmail(name || email.split('@')[0], email, password);
    } else {
      await loginWithEmail(email, password);
    }
    setLoading(false);
    onClose();
  };

  return (
    <>
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

          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-normal tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {mode === 'signin' ? 'Welcome back to Tegaki' : 'Join Tegaki'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {mode === 'signin'
                ? 'Sign in to access your private encrypted journals and published stories.'
                : 'Create an account to write privately or publish your craft.'}
            </p>
          </div>

          {authMethod === 'quick' ? (
            <div className="space-y-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-full flex items-center justify-center gap-3 transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Passkey Button */}
              <button
                type="button"
                onClick={handlePasskey}
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-full flex items-center justify-center gap-3 transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <PasskeyIcon size={18} />
                <span>Continue with Passkey / Face ID</span>
              </button>

              {/* Email Option Switcher */}
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className="w-full py-2.5 px-4 text-sm font-medium rounded-full flex items-center justify-center gap-3 transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <Mail size={16} />
                <span>Continue with Email</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Your Name
                  </label>
                  <div
                    className="flex items-center px-3 py-2 rounded-md"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-soft)',
                    }}
                  >
                    <User size={16} className="mr-2" style={{ color: 'var(--color-text-tertiary)' }} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Haruki Murakami"
                      className="w-full bg-transparent text-sm focus:outline-none"
                      style={{ color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs hover:underline"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div
                  className="flex items-center px-3 py-2 rounded-md"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  <Lock size={16} className="mr-2" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm focus:outline-none"
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2 mt-2"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  color: 'var(--color-bg)',
                  border: '1px solid var(--color-text-primary)',
                }}
              >
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('quick')}
                  className="text-xs hover:underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  ← Other sign in options
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-medium hover:underline"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </>
  );
};
