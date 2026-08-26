import React from 'react';
import { Search, X } from 'lucide-react';

interface TopSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search journals, published stories, or tags...',
}) => {
  return (
    <div
      className="relative flex items-center w-full max-w-xl rounded-full px-4 py-2 transition-colors"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-soft)',
      }}
    >
      <Search
        size={16}
        className="mr-2.5 flex-shrink-0"
        style={{ color: 'var(--color-text-tertiary)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm focus:outline-none placeholder:text-opacity-50"
        style={{
          color: 'var(--color-text-primary)',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="ml-2 p-0.5 rounded-full hover:opacity-75"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
