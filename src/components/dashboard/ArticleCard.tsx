import React, { useState } from 'react';
import type { Article } from '../../types/article';
import { UserAvatar } from '../common/UserAvatar';
import { MessageSquare, Edit3, Trash2, Globe, ExternalLink, Lock, Flame, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArticles } from '../../context/ArticlesContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { PublishModal } from '../writer/PublishModal';

interface ArticleCardProps {
  article: Article;
  onRead: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onClap: (id: string) => void;
  onShare: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onRead,
  onEdit,
  onDelete,
  onClap,
  onShare,
}) => {
  const { user } = useAuth();
  const { updateArticle } = useArticles();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const isOwner = user?.id === article.authorId || user?.username === article.authorUsername;
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const snippet = article.subtitle || article.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';

  const handleUpdateSettings = async (params: {
    slug: string;
    visibility: 'private' | 'published';
    tags: string[];
    subtitle: string;
  }) => {
    await updateArticle(article.id, {
      slug: params.slug,
      visibility: params.visibility,
      tags: params.tags,
      subtitle: params.subtitle,
    });
    setIsSettingsModalOpen(false);
  };

  return (
    <>
      <article
        className="py-6 sm:py-7 group transition-all"
        style={{
          borderBottom: '1px solid var(--color-border-soft)',
        }}
      >
        {/* Author Header Bar: Single-line on mobile & desktop */}
        <div className="flex items-center justify-between mb-2.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <UserAvatar src={article.authorAvatar} name={article.authorName} size="xs" />

            <span className="font-medium truncate max-w-[130px] sm:max-w-[220px]" style={{ color: 'var(--color-text-primary)' }}>
              {article.authorName}
            </span>

            <span className="opacity-60" style={{ color: 'var(--color-text-tertiary)' }}>•</span>

            <span className="whitespace-nowrap text-[11px] sm:text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {formattedDate}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 opacity-90 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
            {isOwner && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSettingsModalOpen(true);
                  }}
                  title="Change Slug & Publication Settings"
                  className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <SlidersHorizontal size={14} strokeWidth={1.75} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(article);
                  }}
                  title="Edit story content"
                  className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Edit3 size={15} strokeWidth={1.75} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                  title="Delete entry permanently"
                  className="p-1.5 rounded hover:text-red-500 hover:opacity-75 cursor-pointer"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Clickable Area */}
        <div
          onClick={() => onRead(article)}
          className="cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-start"
        >
          <div className={article.coverImage ? 'md:col-span-8' : 'md:col-span-12'}>
            <h2
              className="text-lg sm:text-2xl font-serif font-bold tracking-tight mb-1.5 sm:mb-2 leading-snug hover:opacity-90 transition-opacity"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {article.title}
            </h2>

            <p
              className="text-xs sm:text-sm font-serif line-clamp-2 leading-relaxed mb-2.5 sm:mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {snippet}
            </p>
          </div>

          {/* Cover image: 16:9 banner on mobile, 4-col thumbnail on desktop */}
          {article.coverImage && (
            <div className="w-full md:col-span-4 aspect-[16/9] sm:aspect-[16/10] overflow-hidden rounded mb-2 sm:mb-0">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* Footer Metrics, Tags & Truncated Slug Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mt-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="whitespace-nowrap text-[11px] sm:text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {article.readingTimeMinutes} min read
            </span>

            {article.isEncrypted && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px]"
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-text-secondary)',
                }}
                title="Private Journal"
              >
                <Lock size={10} strokeWidth={1.8} />
                <span>Private</span>
              </span>
            )}

            {article.visibility === 'published' && article.slug && (
              <span
                title={`/@${article.authorUsername}/${article.slug}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono max-w-[150px] sm:max-w-[220px] truncate"
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-soft)',
                  color: 'var(--color-accent)',
                }}
              >
                <Globe size={10} strokeWidth={1.8} className="flex-shrink-0" />
                <span className="truncate">/@{article.authorUsername}/{article.slug}</span>
              </span>
            )}

            {article.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 ml-auto sm:ml-0 flex-shrink-0">
            <button
              onClick={() => onClap(article.id)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-xs"
              style={{ color: article.upvotes > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
              title="Applaud"
            >
              <Flame size={14} strokeWidth={1.8} />
              <span>{article.upvotes}</span>
            </button>

            <button
              onClick={() => onRead(article)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Responses"
            >
              <MessageSquare size={14} strokeWidth={1.8} />
              <span>{article.commentCount}</span>
            </button>

            <button
              onClick={() => onShare(article)}
              className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Share"
            >
              <ExternalLink size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(article.id)}
        title={article.title}
      />

      {/* Direct Slug & Publication Settings Modal */}
      <PublishModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title={article.title}
        subtitle={article.subtitle || ''}
        initialSlug={article.slug}
        initialVisibility={article.visibility}
        initialTags={article.tags}
        onConfirmPublish={handleUpdateSettings}
      />
    </>
  );
};
