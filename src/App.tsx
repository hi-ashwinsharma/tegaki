import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import type { ToastMessage } from './components/common/Toast';
import { useArticles } from './hooks/useArticles';
import { useAuth } from './hooks/useAuth';
import type { Article } from './types/article';
import { buildArticlePath } from './services/slugService';
import { Feather, ArrowLeft } from 'lucide-react';

// Route-based code-splitting for optimal initial load speed
const LandingHero = lazy(() => import('./components/landing/LandingHero').then((m) => ({ default: m.LandingHero })));
const ArticleList = lazy(() => import('./components/dashboard/ArticleList').then((m) => ({ default: m.ArticleList })));
const WriterEditor = lazy(() => import('./components/writer/WriterEditor').then((m) => ({ default: m.WriterEditor })));
const PublicationReader = lazy(() => import('./components/reader/PublicationReader').then((m) => ({ default: m.PublicationReader })));
const AuthModal = lazy(() => import('./components/auth/AuthModal').then((m) => ({ default: m.AuthModal })));
const ShareModal = lazy(() => import('./components/reader/ShareModal').then((m) => ({ default: m.ShareModal })));

type ViewMode = 'landing' | 'home' | 'writer' | 'reader';

const ViewLoadingFallback = () => (
  <div className="max-w-2xl mx-auto px-6 py-24 text-center select-none space-y-4">
    <div
      className="w-10 h-10 mx-auto rounded-full flex items-center justify-center animate-pulse"
      style={{
        backgroundColor: 'var(--color-bg-subtle)',
        border: '1px solid var(--color-border-soft)',
        color: 'var(--color-text-tertiary)',
      }}
    >
      <Feather size={18} />
    </div>
    <p className="font-serif text-sm italic" style={{ color: 'var(--color-text-secondary)' }}>
      The page is unfolding...
    </p>
  </div>
);

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    articles,
    findArticleBySlugOrFetch,
    findArticleByIdOrFetch,
    deleteArticle,
    clapArticle,
  } = useArticles();

  // Initial view supports direct hash routing (e.g. #writer, #home)
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const path = window.location.pathname;
    if (path.startsWith('/@') || path.startsWith('/story/')) {
      return 'reader';
    }
    if (hash === 'writer') {
      return 'writer';
    }
    if (hash === 'home' || hash === 'feed') {
      return 'home';
    }
    if (hash === 'landing') {
      return 'landing';
    }
    return isAuthenticated ? 'home' : 'landing';
  });

  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync when authentication status changes
  useEffect(() => {
    if (isAuthenticated && currentView === 'landing') {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  // URL Hash & Path router
  useEffect(() => {
    let isMounted = true;

    const handleHashOrPath = async () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = window.location.pathname;

      if (path.startsWith('/@') || path.startsWith('/story/')) {
        const parts = path.split('/').filter(Boolean);

        if (parts.length === 2 && parts[0].startsWith('@')) {
          const username = decodeURIComponent(parts[0].replace('@', ''));
          const slug = decodeURIComponent(parts[1]);

          // If activeArticle is already this story, retain it cleanly
          if (
            activeArticle &&
            (activeArticle.slug?.toLowerCase() === slug.toLowerCase() ||
              activeArticle.id.toLowerCase() === slug.toLowerCase())
          ) {
            setCurrentView('reader');
            setIsLoadingArticle(false);
            setArticleNotFound(false);
            return;
          }

          setIsLoadingArticle(true);
          setArticleNotFound(false);

          const found = await findArticleBySlugOrFetch(username, slug);
          if (!isMounted) return;

          if (found) {
            setActiveArticle(found);
            setCurrentView('reader');
            setIsLoadingArticle(false);
            return;
          } else {
            setArticleNotFound(true);
            setIsLoadingArticle(false);
            setCurrentView('reader');
            return;
          }
        } else if (parts.length === 2 && parts[0] === 'story') {
          const id = decodeURIComponent(parts[1]);

          if (activeArticle && activeArticle.id === id) {
            setCurrentView('reader');
            setIsLoadingArticle(false);
            setArticleNotFound(false);
            return;
          }

          setIsLoadingArticle(true);
          setArticleNotFound(false);

          const found = await findArticleByIdOrFetch(id);
          if (!isMounted) return;

          if (found) {
            setActiveArticle(found);
            setCurrentView('reader');
            setIsLoadingArticle(false);
            return;
          } else {
            setArticleNotFound(true);
            setIsLoadingArticle(false);
            setCurrentView('reader');
            return;
          }
        }
      }

      if (hash === 'landing') {
        setCurrentView('landing');
      } else if (hash === 'writer') {
        setEditingArticle(null);
        setCurrentView('writer');
      } else if (hash === 'home' || hash === 'feed') {
        setCurrentView('home');
      } else if (path === '/' && !isAuthenticated) {
        setCurrentView('landing');
      } else if (path === '/' && isAuthenticated) {
        setCurrentView('home');
      }
    };

    handleHashOrPath();
    window.addEventListener('popstate', handleHashOrPath);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handleHashOrPath);
    };
  }, [findArticleBySlugOrFetch, findArticleByIdOrFetch, isAuthenticated, articles]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ id: Date.now().toString(), text, type });
  };

  const navigateTo = (view: ViewMode) => {
    setCurrentView(view);
    setArticleNotFound(false);
    setIsLoadingArticle(false);
    if (view === 'home') {
      window.history.pushState(null, '', '/');
    } else if (view === 'writer') {
      window.history.pushState(null, '', '#writer');
    } else if (view === 'landing') {
      window.history.pushState(null, '', '/');
    }
  };

  const handleReadArticle = (article: Article) => {
    setActiveArticle(article);
    setArticleNotFound(false);
    setIsLoadingArticle(false);
    setCurrentView('reader');
    const path = buildArticlePath(article.authorUsername, article.slug, article.id);
    window.history.pushState(null, '', path);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setCurrentView('writer');
    window.history.pushState(null, '', '#writer');
  };

  const handleDeleteArticle = (id: string) => {
    deleteArticle(id);
    showToast('Story deleted successfully', 'info');
    if (activeArticle?.id === id) {
      navigateTo(isAuthenticated ? 'home' : 'landing');
    }
  };

  const handleSavedStory = (article: Article) => {
    showToast(
      article.visibility === 'published'
        ? `Published: /@${article.authorUsername}/${article.slug}`
        : 'Saved & Encrypted locally with AES-256',
      'success'
    );
    handleReadArticle(article);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar is rendered when in home or reading dashboard */}
      {currentView !== 'landing' && currentView !== 'writer' && (
        <Sidebar
          currentView={currentView}
          onNavigate={(v) => {
            if (v === 'writer') {
              setEditingArticle(null);
            }
            navigateTo(v);
          }}
          onOpenAuth={() => handleOpenAuth('signin')}
        />
      )}

      {/* Main View Area with Suspense for lazy loaded modules */}
      <div className={`flex-grow w-full ${currentView === 'home' ? 'pb-20 md:pb-0 md:pl-20' : ''}`}>
        <Suspense fallback={<ViewLoadingFallback />}>
          {currentView === 'landing' && (
            <LandingHero
              onStartWriting={() => {
                setEditingArticle(null);
                navigateTo('writer');
              }}
              onExplorePublic={() => navigateTo('home')}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'home' && (
            <ArticleList
              articles={articles}
              onRead={handleReadArticle}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onClap={(id) => clapArticle(id)}
              onShare={(art) => setSharingArticle(art)}
              onNewStory={() => {
                if (isAuthenticated) {
                  setEditingArticle(null);
                  navigateTo('writer');
                } else {
                  handleOpenAuth('signin');
                }
              }}
            />
          )}

          {currentView === 'writer' && (
            <WriterEditor
              initialArticle={editingArticle}
              onBack={() => navigateTo(isAuthenticated ? 'home' : 'landing')}
              onSaved={handleSavedStory}
            />
          )}

          {currentView === 'reader' && (
            isLoadingArticle ? (
              /* Literary Loading Skeleton */
              <div className="max-w-2xl mx-auto px-6 py-24 text-center select-none space-y-4">
                <div
                  className="w-10 h-10 mx-auto rounded-full flex items-center justify-center animate-pulse"
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  <Feather size={18} />
                </div>
                <p className="font-serif text-sm italic" style={{ color: 'var(--color-text-secondary)' }}>
                  The page is unfolding...
                </p>
              </div>
            ) : articleNotFound ? (
              /* Story Not Found Screen */
              <div className="max-w-2xl mx-auto px-6 py-24 text-center select-none space-y-4">
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-soft)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  <Feather size={20} />
                </div>
                <h2 className="text-2xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Essay Not Found
                </h2>
                <p className="text-xs font-serif max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  This piece may have been returned to a private notebook or moved to a new title.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo(isAuthenticated ? 'home' : 'landing')}
                    className="px-5 py-2 text-xs font-medium rounded-full inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-text-primary)',
                      color: 'var(--color-bg)',
                      border: '1px solid var(--color-text-primary)',
                    }}
                  >
                    <ArrowLeft size={13} />
                    <span>Return to {isAuthenticated ? 'The Desk' : 'Home'}</span>
                  </button>
                </div>
              </div>
            ) : activeArticle ? (
              <PublicationReader
                article={activeArticle}
                onBack={() => navigateTo(isAuthenticated ? 'home' : 'landing')}
                onEdit={handleEditArticle}
              />
            ) : null
          )}
        </Suspense>
      </div>

      {/* Global Modals (Lazy Loaded) */}
      <Suspense fallback={null}>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialMode={authInitialMode}
          />
        )}

        {sharingArticle && (
          <ShareModal
            isOpen={!!sharingArticle}
            onClose={() => setSharingArticle(null)}
            article={sharingArticle}
          />
        )}
      </Suspense>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
