import React, { useState, useEffect, useRef } from 'react';
import type { Article } from '../../types/article';
import { ClapButton } from './ClapButton';
import { CommentsDrawer } from './CommentsDrawer';
import { ShareModal } from './ShareModal';
import { UserAvatar } from '../common/UserAvatar';
import { ArrowLeft, MessageSquare, Share2, Edit3, Lock, Trash2, SlidersHorizontal, Globe } from 'lucide-react';
import { ThemeSelector } from '../common/ThemeSelector';
import { useArticles } from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { PublishModal } from '../writer/PublishModal';
import { buildArticlePath } from '../../services/slugService';
import { highlightAllCodeBlocks } from '../../services/syntaxHighlightService';

interface PublicationReaderProps {
  article: Article;
  onBack: () => void;
  onEdit: (article: Article) => void;
}

export const PublicationReader: React.FC<PublicationReaderProps> = ({
  article,
  onBack,
  onEdit,
}) => {
  const { user } = useAuth();
  const {
    clapArticle,
    getCommentsForArticle,
    addCommentToArticle,
    clapComment,
    decryptJournal,
    updateArticle,
    deleteArticle,
  } = useArticles();

  const [currentArticle, setCurrentArticle] = useState<Article>(article);
  const [decryptedHtml, setDecryptedHtml] = useState<string>(article.content);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const articleBodyRef = useRef<HTMLDivElement>(null);

  // Sync dynamic document title
  useDocumentMeta(currentArticle.title);

  useEffect(() => {
    setCurrentArticle(article);
  }, [article]);

  const isOwner = user?.id === currentArticle.authorId || user?.username === currentArticle.authorUsername;
  const comments = getCommentsForArticle(currentArticle.id);

  useEffect(() => {
    async function loadDecrypted() {
      if (currentArticle.isEncrypted) {
        const decrypted = await decryptJournal(currentArticle);
        setDecryptedHtml(decrypted);
      } else {
        setDecryptedHtml(currentArticle.content);
      }
    }
    loadDecrypted();
  }, [currentArticle, decryptJournal]);

  // Apply Prism syntax highlighting to all code blocks in the reader
  useEffect(() => {
    if (articleBodyRef.current) {
      highlightAllCodeBlocks(articleBodyRef.current);
    }
  }, [decryptedHtml]);

  useEffect(() => {
    const handleCopyClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('code-copy-btn')) {
        const wrapper = target.closest('.code-block-wrapper');
        const code = wrapper?.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.innerText).then(() => {
            target.innerText = 'Copied!';
            setTimeout(() => {
              target.innerText = 'Copy';
            }, 2000);
          });
        }
      }
    };
    document.addEventListener('click', handleCopyClick);
    return () => document.removeEventListener('click', handleCopyClick);
  }, []);

  const formattedDate = new Date(currentArticle.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleUpdateSettings = async (params: {
    title: string;
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle: string;
    coverImage?: string;
  }) => {
    const updated = await updateArticle(currentArticle.id, {
      title: params.title || currentArticle.title,
      slug: params.slug,
      visibility: params.visibility,
      tags: params.tags,
      subtitle: params.subtitle,
      coverImage: params.coverImage,
    });
    if (updated) {
      setCurrentArticle(updated);
      const newPath = buildArticlePath(updated.authorUsername, updated.slug, updated.id);
      window.history.replaceState(null, '', newPath);
    }
    setIsSettingsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteArticle(currentArticle.id);
    onBack();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Reading Navigation */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border-soft)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer flex-shrink-0"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Back to all writings"
          >
            <ArrowLeft size={18} />
          </button>

          <span className="text-sm font-serif font-medium hidden sm:inline" style={{ color: 'var(--color-text-primary)' }}>
            Tegaki
          </span>

          {currentArticle.slug && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono max-w-[240px] truncate" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-secondary)' }}>
              <Globe size={11} className="flex-shrink-0" />
              <span className="truncate">/@{currentArticle.authorUsername}/{currentArticle.slug}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <ThemeSelector compact />

          {isOwner && (
            <>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-primary)',
                }}
                title="Change slug & settings"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">Settings</span>
              </button>

              <button
                onClick={() => onEdit(currentArticle)}
                className="p-2 sm:px-3.5 sm:py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-primary)',
                }}
                title="Edit story"
              >
                <Edit3 size={13} />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 rounded-full hover:text-red-500 hover:opacity-75 transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-tertiary)',
                }}
                title="Delete story permanently"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}

          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-full hover:opacity-75 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-secondary)',
            }}
            title="Share story"
          >
            <Share2 size={15} />
          </button>
        </div>
      </header>

      {/* Main Article Reading Container */}
      <main className="flex-grow max-w-2xl sm:max-w-3xl w-full mx-auto px-4 sm:px-10 py-6 sm:py-12">
        {/* Title */}
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3 sm:mb-4 leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {currentArticle.title}
        </h1>

        {/* Subtitle */}
        {currentArticle.subtitle && (
          <p
            className="text-base sm:text-xl font-serif leading-relaxed mb-4 sm:mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {currentArticle.subtitle}
          </p>
        )}

        {/* Author Header Row */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between py-3.5 sm:py-4 my-4 sm:my-6"
          style={{
            borderTop: '1px solid var(--color-border-soft)',
            borderBottom: '1px solid var(--color-border-soft)',
          }}
        >
          <div className="flex items-center gap-3">
            <UserAvatar src={currentArticle.authorAvatar} name={currentArticle.authorName} size="lg" />

            <div>
              <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <span>{currentArticle.authorName}</span>
                {currentArticle.isEncrypted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-normal" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Lock size={11} />
                    <span>Private</span>
                  </span>
                )}
              </div>
              <div className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                <span>{currentArticle.readingTimeMinutes} min read</span>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <ClapButton count={currentArticle.upvotes} onClap={() => clapArticle(currentArticle.id)} />
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-opacity hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <MessageSquare size={13} />
              <span>{currentArticle.commentCount}</span>
            </button>
          </div>
        </div>

        {/* Cover Image if present */}
        {currentArticle.coverImage && (
          <div className="my-6 sm:my-8 rounded-lg overflow-hidden">
            <img src={currentArticle.coverImage} alt={currentArticle.title} referrerPolicy="no-referrer" className="w-full max-h-[480px] object-cover" />
          </div>
        )}

        {/* Story Body in Medium Editorial Typography */}
        <div
          ref={articleBodyRef}
          className="font-editorial text-base sm:text-xl leading-relaxed space-y-5 sm:space-y-6 pt-2"
          style={{ color: 'var(--color-text-primary)' }}
          dangerouslySetInnerHTML={{ __html: decryptedHtml }}
        />

        {/* Tags */}
        {currentArticle.tags && currentArticle.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 sm:pt-12">
            {currentArticle.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Claps & Responses Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 py-4 sm:py-6 mt-8 sm:mt-12"
          style={{ borderTop: '1px solid var(--color-border-soft)' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <ClapButton count={currentArticle.upvotes} onClap={() => clapArticle(currentArticle.id)} />
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs transition-opacity hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <MessageSquare size={15} />
              <span>Responses ({currentArticle.commentCount})</span>
            </button>
          </div>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-opacity hover:opacity-80 cursor-pointer ml-auto sm:ml-0"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </main>

      {/* Response Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={comments}
        onAddComment={(content) => addCommentToArticle(currentArticle.id, content)}
        onClapComment={(cId) => clapComment(cId)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        article={currentArticle}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={currentArticle.title}
      />

      {/* Slug & Publication Settings Modal */}
      <PublishModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title={currentArticle.title}
        subtitle={currentArticle.subtitle || ''}
        content={decryptedHtml}
        initialSlug={currentArticle.slug}
        initialVisibility={currentArticle.visibility}
        initialTags={currentArticle.tags}
        initialCoverImage={currentArticle.coverImage}
        onConfirmPublish={handleUpdateSettings}
      />
    </div>
  );
};
