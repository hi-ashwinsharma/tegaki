import React, { useState, useEffect } from 'react';
import type { Article } from '../../types/article';
import { ClapButton } from './ClapButton';
import { CommentsDrawer } from './CommentsDrawer';
import { ShareModal } from './ShareModal';
import { ArrowLeft, MessageSquare, Share2, Edit3, Lock } from 'lucide-react';
import { ThemeSelector } from '../common/ThemeSelector';
import { useArticles } from '../../context/ArticlesContext';
import { useAuth } from '../../context/AuthContext';

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
  } = useArticles();

  const [decryptedHtml, setDecryptedHtml] = useState<string>(article.content);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const isOwner = user?.id === article.authorId || user?.username === article.authorUsername;
  const comments = getCommentsForArticle(article.id);

  useEffect(() => {
    async function loadDecrypted() {
      if (article.isEncrypted) {
        const decrypted = await decryptJournal(article);
        setDecryptedHtml(decrypted);
      } else {
        setDecryptedHtml(article.content);
      }
    }
    loadDecrypted();
  }, [article, decryptJournal]);

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Reading Navigation */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 backdrop-blur-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border-soft)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Back to all writings"
          >
            <ArrowLeft size={18} />
          </button>

          <span className="text-sm font-serif font-medium hidden sm:inline" style={{ color: 'var(--color-text-primary)' }}>
            Tegaki
          </span>

          {article.slug && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-secondary)' }}>
              <span>/@{article.authorUsername}/{article.slug}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeSelector compact />

          {isOwner && (
            <button
              onClick={() => onEdit(article)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
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
      <main className="flex-grow max-w-2xl sm:max-w-3xl w-full mx-auto px-6 sm:px-10 py-12">
        {/* Title */}
        <h1
          className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4 leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p
            className="text-lg sm:text-xl font-serif leading-relaxed mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {article.subtitle}
          </p>
        )}

        {/* Author Header Row */}
        <div
          className="flex items-center justify-between py-4 my-6"
          style={{
            borderTop: '1px solid var(--color-border-soft)',
            borderBottom: '1px solid var(--color-border-soft)',
          }}
        >
          <div className="flex items-center gap-3">
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                {article.authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <span>{article.authorName}</span>
                {article.isEncrypted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-normal" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Lock size={11} />
                    <span>Private</span>
                  </span>
                )}
              </div>
              <div className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                <span>{article.readingTimeMinutes} min read</span>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClapButton count={article.upvotes} onClap={() => clapArticle(article.id)} />
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
              <span>{article.commentCount}</span>
            </button>
          </div>
        </div>

        {/* Cover Image if present */}
        {article.coverImage && (
          <div className="my-8 rounded-lg overflow-hidden">
            <img src={article.coverImage} alt={article.title} className="w-full max-h-[480px] object-cover" />
          </div>
        )}

        {/* Story Body in Medium Editorial Typography */}
        <div
          className="font-editorial text-lg sm:text-xl leading-relaxed space-y-6 pt-2"
          style={{ color: 'var(--color-text-primary)' }}
          dangerouslySetInnerHTML={{ __html: decryptedHtml }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-12">
            {article.tags.map((t) => (
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
          className="flex items-center justify-between py-6 mt-12"
          style={{ borderTop: '1px solid var(--color-border-soft)' }}
        >
          <div className="flex items-center gap-4">
            <ClapButton count={article.upvotes} onClap={() => clapArticle(article.id)} />
            <button
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-opacity hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <MessageSquare size={15} />
              <span>Responses ({article.commentCount})</span>
            </button>
          </div>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-opacity hover:opacity-80 cursor-pointer"
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
        onAddComment={(content) => addCommentToArticle(article.id, content)}
        onClapComment={(cId) => clapComment(cId)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        article={article}
      />
    </div>
  );
};
