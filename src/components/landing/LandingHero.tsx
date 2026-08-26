import React, { useState, useRef, useEffect } from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { PrivacyModal } from './PrivacyModal';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../types/theme';
import {
  ArrowRight,
  Lock,
  Globe,
  Feather,
  ArrowUpRight,
  Check,
  Bold,
  Italic,
  Link2,
  Quote,
  Plus,
  Flame,
  MessageSquare,
  Share2,
  BellOff,
  Zap,
} from 'lucide-react';
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

  // Interactive Live Sheet of Paper State
  const [interactiveTitle, setInteractiveTitle] = useState('The Solitude of First Thoughts');
  const [interactiveVisibility, setInteractiveVisibility] = useState<'private' | 'published'>('private');
  const [interactiveSlug, setInteractiveSlug] = useState('first-thoughts');
  const [interactiveSaved, setInteractiveSaved] = useState(true);
  const [interactiveToolbarPos, setInteractiveToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [interactivePlusOpen, setInteractivePlusOpen] = useState(false);
  const [showSlugPreview, setShowSlugPreview] = useState(false);
  const interactiveEditorRef = useRef<HTMLDivElement>(null);

  // Two Spheres Interactive Lens State
  const [activeSphere, setActiveSphere] = useState<'private' | 'public'>('private');

  // Track text selection inside interactive paper canvas
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !interactiveEditorRef.current) {
        setInteractiveToolbarPos(null);
        return;
      }
      if (!interactiveEditorRef.current.contains(sel.anchorNode)) {
        setInteractiveToolbarPos(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0) {
        setInteractiveToolbarPos({
          top: rect.top,
          left: rect.left + rect.width / 2,
        });
      } else {
        setInteractiveToolbarPos(null);
      }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const handleFormatCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    setInteractiveSaved(false);
    setTimeout(() => setInteractiveSaved(true), 600);
  };

  const handleInsertInteractiveDivider = () => {
    if (interactiveEditorRef.current) {
      interactiveEditorRef.current.focus();
      document.execCommand('insertHTML', false, '<hr class="editorial-divider my-6" /><p><br></p>');
      setInteractivePlusOpen(false);
      setInteractiveSaved(false);
      setTimeout(() => setInteractiveSaved(true), 600);
    }
  };

  const handleInsertInteractiveQuote = () => {
    if (interactiveEditorRef.current) {
      interactiveEditorRef.current.focus();
      document.execCommand('insertHTML', false, '<blockquote class="editorial-quote">Write your first draft in the dark.</blockquote><p><br></p>');
      setInteractivePlusOpen(false);
      setInteractiveSaved(false);
      setTimeout(() => setInteractiveSaved(true), 600);
    }
  };

  return (
    <div
      className="min-h-screen selection:bg-neutral-200 dark:selection:bg-neutral-800"
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
          <ThemeSelector compact placement="bottom-right" />

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

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Full Viewport Height) */}
      {/* ========================================================================= */}
      <section className="min-h-[calc(100vh-65px)] flex flex-col justify-center max-w-6xl mx-auto px-6 sm:px-12 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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
              <span className="inline-block whitespace-nowrap sm:whitespace-normal xl:whitespace-nowrap">
                First for yourself.
              </span>
              <br />
              <span className="italic font-normal opacity-90">
                Then, for the world.
              </span>
            </h1>

            <p
              className="text-base sm:text-lg font-serif max-w-xl leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Tegaki is a quiet sanctuary for unhurried thought. A notebook without algorithms, metrics, or premature audience anxiety—where ideas mature in private before entering the world.
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
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. IT ALL STARTS WITH A SHEET OF PAPER (Full Viewport Height & Interactive) */}
      {/* ========================================================================= */}
      <section
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16"
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          backgroundColor: 'var(--color-bg-subtle)',
        }}
      >
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              It all starts with a sheet of paper.
            </h2>
            <p className="text-xs sm:text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
              Try it below: Select text to format, type your thoughts, or click + to add margin notes.
            </p>
          </div>

          {/* Interactive Live Mini-Writer Canvas */}
          <div
            className="rounded-2xl p-6 sm:p-10 select-none relative transition-all"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            {/* Floating Selection Toolbar Popup */}
            {interactiveToolbarPos && (
              <div
                className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2 flex items-center px-1.5 py-1 rounded-lg select-none animate-fade-in"
                style={{
                  top: interactiveToolbarPos.top - 6,
                  left: interactiveToolbarPos.left,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleFormatCommand('bold');
                  }}
                  className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                  title="Bold"
                >
                  <Bold size={13} strokeWidth={2} />
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleFormatCommand('italic');
                  }}
                  className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                  title="Italic"
                >
                  <Italic size={13} strokeWidth={2} />
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter link URL:');
                    if (url) handleFormatCommand('createLink', url);
                  }}
                  className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                  title="Add Link"
                >
                  <Link2 size={13} />
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleFormatCommand('formatBlock', '<blockquote>');
                  }}
                  className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                  title="Quote"
                >
                  <Quote size={13} />
                </button>
              </div>
            )}

            {/* Writer Header Simulation */}
            <div
              className="flex items-center justify-between pb-4 mb-6 text-xs"
              style={{ borderBottom: '1px solid var(--color-border-soft)' }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                {interactiveSaved ? (
                  <>
                    <Check size={13} style={{ color: 'var(--color-accent)' }} />
                    <span>Preserved in silence</span>
                  </>
                ) : (
                  <span>Inking draft...</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Privacy Pill Switcher */}
                <div
                  className="flex items-center p-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  <button
                    onClick={() => {
                      setInteractiveVisibility('private');
                      setShowSlugPreview(false);
                    }}
                    className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: interactiveVisibility === 'private' ? 'var(--color-bg)' : 'transparent',
                      color: interactiveVisibility === 'private' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                      fontWeight: interactiveVisibility === 'private' ? 600 : 400,
                    }}
                  >
                    <Lock size={11} strokeWidth={1.8} />
                    <span>Private</span>
                  </button>

                  <button
                    onClick={() => {
                      setInteractiveVisibility('published');
                      setShowSlugPreview(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: interactiveVisibility === 'published' ? 'var(--color-bg)' : 'transparent',
                      color: interactiveVisibility === 'published' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                      fontWeight: interactiveVisibility === 'published' ? 600 : 400,
                    }}
                  >
                    <Globe size={11} strokeWidth={1.8} />
                    <span>Public</span>
                  </button>
                </div>

                {interactiveVisibility === 'published' && (
                  <button
                    onClick={() => setShowSlugPreview(!showSlugPreview)}
                    className="px-3 py-1 text-[11px] font-medium rounded-full cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: '#FFFFFF',
                      border: '1px solid var(--color-accent)',
                    }}
                  >
                    Slug: /@{interactiveSlug}
                  </button>
                )}
              </div>
            </div>

            {/* Custom Slug Drawer Simulation */}
            {showSlugPreview && interactiveVisibility === 'published' && (
              <div
                className="mb-6 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Globe size={14} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Live Publication Route:</span>
                  <code className="font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                    /@you/{interactiveSlug}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={interactiveSlug}
                    onChange={(e) => setInteractiveSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="custom-slug"
                    className="px-2 py-1 text-[11px] font-mono rounded bg-transparent focus:outline-none"
                    style={{
                      border: '1px solid var(--color-border-soft)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    (Author Defined)
                  </span>
                </div>
              </div>
            )}

            {/* Editable Canvas Content */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <input
                type="text"
                value={interactiveTitle}
                onChange={(e) => {
                  setInteractiveTitle(e.target.value);
                  setInteractiveSaved(false);
                  setTimeout(() => setInteractiveSaved(true), 600);
                }}
                className="w-full bg-transparent font-serif font-bold text-2xl sm:text-4xl tracking-tight focus:outline-none"
                style={{ color: 'var(--color-text-primary)' }}
              />

              <div className="w-full h-px" style={{ backgroundColor: 'var(--color-border-soft)' }} />

              <div
                ref={interactiveEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  setInteractiveSaved(false);
                  setTimeout(() => setInteractiveSaved(true), 600);
                }}
                className="font-editorial text-base sm:text-lg leading-relaxed focus:outline-none min-h-[140px]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Writing is an honest dialogue with oneself. The blank page offers freedom without the pressure of a crowd watching your first draft. Highlight any sentence to format.
              </div>

              {/* Plus Button Simulation */}
              <div className="flex items-center gap-3 pt-2 text-xs select-none">
                <div className="relative">
                  <button
                    onClick={() => setInteractivePlusOpen(!interactivePlusOpen)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer"
                    style={{
                      border: '1px solid var(--color-border-soft)',
                      backgroundColor: 'var(--color-bg-surface)',
                      color: 'var(--color-text-secondary)',
                      transform: interactivePlusOpen ? 'rotate(45deg)' : 'none',
                    }}
                  >
                    <Plus size={13} strokeWidth={2} />
                  </button>

                  {interactivePlusOpen && (
                    <div
                      className="absolute left-8 top-0 flex items-center gap-2 p-1.5 rounded-full animate-fade-in z-20"
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-soft)',
                      }}
                    >
                      <button
                        onClick={handleInsertInteractiveQuote}
                        className="px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1 hover:opacity-80 cursor-pointer"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <Quote size={11} />
                        <span>Quote</span>
                      </button>
                      <button
                        onClick={handleInsertInteractiveDivider}
                        className="px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1 hover:opacity-80 cursor-pointer"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <span>— Divider</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="font-serif text-xs italic" style={{ color: 'var(--color-text-tertiary)' }}>
                  Interactive live sheet • Click into the text above to write
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TWO SPHERES OF THOUGHT (Full Viewport Height & Creative Interactive Dial) */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 4. FOUR CALIBRATED READING THEMES (Full Viewport Height & Circle Reveal) */}
      {/* ========================================================================= */}
      <section
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16 text-center"
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          borderBottom: '1px solid var(--color-border-soft)',
          backgroundColor: 'var(--color-bg-subtle)',
        }}
      >
        <div className="max-w-4xl mx-auto w-full space-y-10">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Four Calibrated Reading Themes
            </h2>
            <p className="text-xs sm:text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
              Click any canvas below to experience the smooth circular reveal transition across the entire platform.
            </p>
          </div>

          {/* 4 Visual Mini-Canvas Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {themes.map((t) => {
              const active = theme === t.id;
              const isDarkTheme = t.id === 'dark-gray' || t.id === 'amoled';

              return (
                <div
                  key={t.id}
                  onClick={(e) => setTheme(t.id as ThemeMode, e)}
                  className="p-5 rounded-2xl text-left cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98] select-none flex flex-col justify-between h-56"
                  style={{
                    backgroundColor: t.previewBg,
                    border: active ? '2px solid var(--color-accent)' : `1px solid ${t.previewBorder}`,
                    color: isDarkTheme ? '#EFEFEF' : '#1F1F1F',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-serif">{t.name}</span>
                      {active && <Check size={14} style={{ color: 'var(--color-accent)' }} />}
                    </div>

                    <div
                      className="p-2.5 rounded-lg text-[11px] font-editorial space-y-1.5"
                      style={{
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="font-bold text-xs">A quiet evening...</div>
                      <div className="opacity-75 text-[10px] line-clamp-2 leading-relaxed">
                        The ink settles into the grain of the page without noise.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] opacity-60 font-mono flex items-center justify-between">
                    <span>{t.desc}</span>
                    <span className="font-bold">{active ? 'ACTIVE' : 'APPLY'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FINAL QUIET INVITATION & FOOTER (Full Viewport Height) */}
      {/* ========================================================================= */}
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
      </section>

      {/* Privacy Policy & Terms Modal */}
      <PrivacyModal
        isOpen={modalState !== null}
        onClose={() => setModalState(null)}
        mode={modalState || 'privacy'}
      />
    </div>
  );
};
