import React, { useState, useMemo } from 'react';
import type { Article } from '../../types/article';
import { TopSearchBar } from '../common/TopSearchBar';
import { FilterTabs } from './FilterTabs';
import type { FilterOption } from './FilterTabs';
import { ArticleCard } from './ArticleCard';
import { Feather } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (filter === 'private' && art.visibility !== 'private') return false;
      if (filter === 'published' && art.visibility !== 'published') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        (art.subtitle && art.subtitle.toLowerCase().includes(q)) ||
        art.authorName.toLowerCase().includes(q) ||
        art.tags?.some((t) => t.toLowerCase().includes(q)) ||
        art.content.toLowerCase().includes(q)
      );
    });
  }, [articles, filter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: articles.length,
      private: articles.filter((a) => a.visibility === 'private').length,
      published: articles.filter((a) => a.visibility === 'published').length,
    };
  }, [articles]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      {/* Top Search Bar & Action with whitespace */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <TopSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search stories, journals, tags, or authors..."
        />

        <button
          onClick={onNewStory}
          className="w-full sm:w-auto px-5 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
          style={{
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-bg)',
            border: '1px solid var(--color-text-primary)',
          }}
        >
          <Feather size={14} strokeWidth={1.8} />
          <span>Write Story</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <FilterTabs current={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* Articles Feed */}
      {filteredArticles.length > 0 ? (
        <div className="divide-y divide-transparent">
          {filteredArticles.map((art) => (
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
        <div className="text-center py-20">
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-soft)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Feather size={22} strokeWidth={1.6} />
          </div>
          <h3 className="text-lg font-serif font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
            No entries found
          </h3>
          <p className="text-xs max-w-sm mx-auto mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {searchQuery
              ? `No journals or stories matching "${searchQuery}"`
              : filter === 'private'
              ? 'You have no private journals yet.'
              : 'No published stories available yet.'}
          </p>
          <button
            onClick={onNewStory}
            className="px-5 py-2 text-xs font-medium rounded-full transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '1px solid var(--color-text-primary)',
            }}
          >
            Start writing
          </button>
        </div>
      )}
    </div>
  );
};
