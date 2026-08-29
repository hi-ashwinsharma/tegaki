import React, { useState, useMemo } from 'react';
import type { Article } from '../../types/article';
import { TopSearchBar } from '../common/TopSearchBar';
import { FilterTabs } from './FilterTabs';
import type { FilterOption } from './FilterTabs';
import { ArticleCard } from './ArticleCard';
import { Feather, Plus, Clock, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type SortOption = 'latest' | 'upvotes';

interface ArticleListProps {
  articles: Article[];
  onRead: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onClap: (id: string) => void;
  onShare: (article: Article) => void;
  onNewStory: () => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  onRead,
  onEdit,
  onDelete,
  onClap,
  onShare,
  onNewStory,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Filter and sort all entries
  const processedArticles = useMemo(() => {
    // 1. Filter
    const filtered = articles.filter((art) => {
      // In private tab: strictly show logged-in user's private journals only
      if (filter === 'private') {
        if (art.visibility !== 'private') return false;
        if (!user || (art.authorId !== user.id && art.authorUsername !== user.username)) return false;
      }

      // In published tab: show all published stories from any author
      if (filter === 'published') {
        if (art.visibility !== 'published') return false;
      }

      // In 'all' tab: show all published stories from any author + user's own private notes
      if (filter === 'all') {
        if (art.visibility === 'private') {
          if (!user || (art.authorId !== user.id && art.authorUsername !== user.username)) {
            return false;
          }
        }
      }

      // Search query filtering
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        (art.subtitle && art.subtitle.toLowerCase().includes(q)) ||
        art.authorName.toLowerCase().includes(q) ||
        art.authorUsername.toLowerCase().includes(q) ||
        art.tags?.some((t) => t.toLowerCase().includes(q)) ||
        art.content.toLowerCase().includes(q)
      );
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'upvotes') {
        const diff = (b.upvotes || 0) - (a.upvotes || 0);
        if (diff !== 0) return diff;
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [articles, filter, sortBy, searchQuery, user]);

  const counts = useMemo(() => {
    const userPrivateCount = articles.filter(
      (a) =>
        a.visibility === 'private' &&
        user &&
        (a.authorId === user.id || a.authorUsername === user.username)
    ).length;

    const publishedCount = articles.filter((a) => a.visibility === 'published').length;

    return {
      all: userPrivateCount + publishedCount,
      private: userPrivateCount,
      published: publishedCount,
    };
  }, [articles, user]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Row 1: Search & New Entry */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <TopSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search thoughts, reflections, or authors..."
        />

        <button
          onClick={onNewStory}
          className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer select-none"
          style={{
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-bg)',
            border: '1px solid var(--color-text-primary)',
          }}
        >
          <Feather size={14} strokeWidth={1.8} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Row 2: Clean Full-Width Filter Tabs with Baseline Hairline Border */}
      <div className="mb-3">
        <FilterTabs current={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* Row 3: Quiet Secondary Meta & Sort Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-xs py-2 mb-3 sm:mb-4 select-none"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        <span className="font-mono text-[11px]">
          {processedArticles.length} {processedArticles.length === 1 ? 'thought' : 'thoughts'}
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
          <span className="text-[11px] opacity-75 hidden sm:inline">Sort:</span>
          <div
            className="flex items-center p-0.5 sm:p-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <button
              onClick={() => setSortBy('latest')}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs rounded-full transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5"
              style={{
                backgroundColor: sortBy === 'latest' ? 'var(--color-bg)' : 'transparent',
                border: sortBy === 'latest' ? '1px solid var(--color-border-soft)' : '1px solid transparent',
                color: sortBy === 'latest' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: sortBy === 'latest' ? 600 : 400,
              }}
            >
              <Clock size={13} strokeWidth={1.75} />
              <span>Latest</span>
            </button>

            <button
              onClick={() => setSortBy('upvotes')}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs rounded-full transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5"
              style={{
                backgroundColor: sortBy === 'upvotes' ? 'var(--color-bg)' : 'transparent',
                border: sortBy === 'upvotes' ? '1px solid var(--color-border-soft)' : '1px solid transparent',
                color: sortBy === 'upvotes' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                fontWeight: sortBy === 'upvotes' ? 600 : 400,
              }}
            >
              <Flame size={13} strokeWidth={1.75} />
              <span>Most Resonated</span>
            </button>
          </div>
        </div>
      </div>

      {/* Articles Feed */}
      {processedArticles.length > 0 ? (
        <div className="divide-y divide-transparent">
          {processedArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              onRead={onRead}
              onEdit={onEdit}
              onDelete={onDelete}
              onClap={onClap}
              onShare={onShare}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 select-none">
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Feather size={20} strokeWidth={1.6} />
          </div>
          <h3 className="text-lg font-serif font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
            {searchQuery
              ? 'No matching thoughts'
              : filter === 'private'
              ? 'Your private notebook is quiet.'
              : filter === 'published'
              ? 'No published works yet.'
              : 'The page is quiet.'}
          </h3>
          <p className="text-xs max-w-xs mx-auto mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {searchQuery
              ? `No reflections found for "${searchQuery}"`
              : 'No entries yet. Pour your first thought into ink.'}
          </p>
          <button
            onClick={onNewStory}
            className="px-6 py-2.5 text-xs font-medium rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '1px solid var(--color-text-primary)',
            }}
          >
            <Plus size={13} strokeWidth={2} />
            <span>Dip the Pen</span>
          </button>
        </div>
      )}
    </div>
  );
};
