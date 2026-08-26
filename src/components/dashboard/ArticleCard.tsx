import React from 'react';
import type { Article } from '../../types/article';
import { UserAvatar } from '../common/UserAvatar';
import { MessageSquare, Edit3, Trash2, Globe, ExternalLink, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const isOwner = user?.id === article.authorId || user?.username === article.authorUsername;
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const snippet = article.subtitle || article.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';

  return (
    <article
      className="py-7 group transition-all"
      style={{
        borderBottom: '1px solid var(--color-border-soft)',
      }}
    >
      {/* Author Bar */}
      <div className="flex items-center justify-between mb-2.5 text-xs">
        <div className="flex items-center gap-2">
          <UserAvatar src={article.authorAvatar} name={article.authorName} size="xs" />

          <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {article.authorName}
          </span>

          <span style={{ color: 'var(--color-text-tertiary)' }}>•</span>

          <span style={{ color: 'var(--color-text-secondary)' }}>{formattedDate}</span>

          {article.isEncrypted && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px]"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-secondary)',
              }}
              title="Private Journal"
            >
              <Lock size={11} strokeWidth={1.8} />
              <span>Private</span>
            </span>
          )}

          {article.visibility === 'published' && article.slug && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-accent)',
              }}
            >
              <Globe size={11} strokeWidth={1.8} />
              <span>/@{article.authorUsername}/{article.slug}</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(article)}
                title="Edit story"
                className="p-1.5 rounded hover:opacity-75 cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Edit3 size={15} strokeWidth={1.75} />
              </button>
              <button
                onClick={() => onDelete(article.id)}
                title="Delete entry"
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
        className="cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
      >
        <div className={article.coverImage ? 'md:col-span-8' : 'md:col-span-12'}>
          <h2
            className="text-xl sm:text-2xl font-serif font-bold tracking-tight mb-2 leading-snug hover:opacity-90 transition-opacity"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {article.title}
          </h2>

          <p
            className="text-sm font-serif line-clamp-2 leading-relaxed mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {snippet}
          </p>
        </div>

        {article.coverImage && (
          <div className="md:col-span-4 aspect-video sm:aspect-[16/10] overflow-hidden rounded">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Footer Metrics & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs">
        <div className="flex items-center gap-3">
          <span style={{ color: 'var(--color-text-tertiary)' }}>
            {article.readingTimeMinutes} min read
          </span>

          {article.tags?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.8 rounded-full"
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

        <div className="flex items-center gap-4">
          <button
            onClick={() => onClap(article.id)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Applaud"
          >
            <Sparkles size={14} strokeWidth={1.8} className={article.upvotes > 0 ? 'text-amber-500 fill-amber-500' : ''} />
            <span>{article.upvotes}</span>
          </button>

          <button
            onClick={() => onRead(article)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
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
  );
};
