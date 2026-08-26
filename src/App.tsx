import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { LandingHero } from './components/landing/LandingHero';
import { ArticleList } from './components/dashboard/ArticleList';
import { WriterEditor } from './components/writer/WriterEditor';
import { PublicationReader } from './components/reader/PublicationReader';
import { AuthModal } from './components/auth/AuthModal';
import { ShareModal } from './components/reader/ShareModal';
import { Toast } from './components/common/Toast';
import type { ToastMessage } from './components/common/Toast';
import { useArticles } from './context/ArticlesContext';
import { useAuth } from './context/AuthContext';
import type { Article } from './types/article';
import { buildArticlePath } from './services/slugService';

type ViewMode = 'landing' | 'home' | 'writer' | 'reader';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    articles,
    getArticleById,
    getArticleBySlug,
    deleteArticle,
    clapArticle,
  } = useArticles();

  // Initial view is 'landing' if not authenticated, otherwise 'home'
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/@') || path.startsWith('/story/')) {
      return 'reader';
    }
    return isAuthenticated ? 'home' : 'landing';
  });

  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync when authentication status changes
  useEffect(() => {
    if (!isAuthenticated && currentView === 'writer') {
      setCurrentView('landing');
    } else if (isAuthenticated && currentView === 'landing') {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  // URL Hash & Path router
  useEffect(() => {
    const handleHashOrPath = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = window.location.pathname;

      if (path.startsWith('/@') || path.startsWith('/story/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 2 && parts[0].startsWith('@')) {
          const username = parts[0].replace('@', '');
          const slug = parts[1];
          const found = getArticleBySlug(username, slug);
          if (found) {
            setActiveArticle(found);
            setCurrentView('reader');
            return;
          }
        } else if (parts.length === 2 && parts[0] === 'story') {
          const found = getArticleById(parts[1]);
          if (found) {
            setActiveArticle(found);
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
      }
    };

    handleHashOrPath();
    window.addEventListener('popstate', handleHashOrPath);
    return () => window.removeEventListener('popstate', handleHashOrPath);
  }, [getArticleBySlug, getArticleById, isAuthenticated]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ id: Date.now().toString(), text, type });
  };

  const navigateTo = (view: ViewMode) => {
    setCurrentView(view);
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
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteArticle(id);
      showToast('Story deleted successfully', 'info');
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

      {/* Main View Area */}
      <div className={`flex-grow ${currentView === 'home' ? 'pl-16 md:pl-20' : ''}`}>
        {currentView === 'landing' && (
          <LandingHero
            onStartWriting={() => {
              if (isAuthenticated) {
                setEditingArticle(null);
                navigateTo('writer');
              } else {
                handleOpenAuth('signup');
              }
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

        {currentView === 'reader' && activeArticle && (
          <PublicationReader
            article={activeArticle}
            onBack={() => navigateTo(isAuthenticated ? 'home' : 'landing')}
            onEdit={handleEditArticle}
          />
        )}
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
      />

      <ShareModal
        isOpen={!!sharingArticle}
        onClose={() => setSharingArticle(null)}
        article={sharingArticle}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
