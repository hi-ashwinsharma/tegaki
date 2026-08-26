import React from 'react';
import { Lock, Globe, BookOpen } from 'lucide-react';

export type FilterOption = 'all' | 'private' | 'published';

interface FilterTabsProps {
  current: FilterOption;
  onChange: (filter: FilterOption) => void;
  counts: { all: number; private: number; published: number };
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ current, onChange, counts }) => {
  return (
    <div
      className="flex items-center gap-1 sm:gap-2 pb-px overflow-x-auto select-none"
      style={{ borderBottom: '1px solid var(--color-border-soft)' }}
    >
      <button
        onClick={() => onChange('all')}
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-medium transition-colors relative cursor-pointer"
        style={{
          color: current === 'all' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
        }}
      >
        <BookOpen size={14} strokeWidth={1.75} />
        <span>All Stories</span>
        <span
          className="text-[11px] px-1.5 py-0.2 rounded-full font-mono"
          style={{
            backgroundColor: current === 'all' ? 'var(--color-bg-subtle)' : 'transparent',
            color: 'var(--color-text-secondary)',
          }}
        >
          {counts.all}
        </span>
        {current === 'all' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px]"
            style={{ backgroundColor: 'var(--color-text-primary)' }}
          />
        )}
      </button>

      <button
        onClick={() => onChange('private')}
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-medium transition-colors relative cursor-pointer"
        style={{
          color: current === 'private' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
        }}
      >
        <Lock size={13} strokeWidth={1.75} />
        <span>Private Journals</span>
        <span
          className="text-[11px] px-1.5 py-0.2 rounded-full font-mono"
          style={{
            backgroundColor: current === 'private' ? 'var(--color-bg-subtle)' : 'transparent',
            color: 'var(--color-text-secondary)',
          }}
        >
          {counts.private}
        </span>
        {current === 'private' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px]"
            style={{ backgroundColor: 'var(--color-text-primary)' }}
          />
        )}
      </button>

      <button
        onClick={() => onChange('published')}
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-medium transition-colors relative cursor-pointer"
        style={{
          color: current === 'published' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
        }}
      >
        <Globe size={14} strokeWidth={1.75} />
        <span>Published</span>
        <span
          className="text-[11px] px-1.5 py-0.2 rounded-full font-mono"
          style={{
            backgroundColor: current === 'published' ? 'var(--color-bg-subtle)' : 'transparent',
            color: 'var(--color-text-secondary)',
          }}
        >
          {counts.published}
        </span>
        {current === 'published' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[1.5px]"
            style={{ backgroundColor: 'var(--color-text-primary)' }}
          />
        )}
      </button>
    </div>
  );
};
