import React, { useState } from 'react';
import { MediumClapIcon } from '../common/Icons';

interface ClapButtonProps {
  count: number;
  onClap: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ClapButton: React.FC<ClapButtonProps> = ({ count, onClap, size = 'md' }) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    onClap();
    setTimeout(() => setAnimating(false), 300);
  };

  const iconSizes = { sm: 18, md: 22, lg: 26 };

  return (
    <button
      onClick={handleClick}
      title="Clap / Upvote story"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-transform ${
        animating ? 'scale-110' : 'hover:scale-105 active:scale-95'
      }`}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-soft)',
        color: count > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      }}
    >
      <MediumClapIcon size={iconSizes[size]} active={count > 0} />
      <span className="text-xs font-mono font-medium">{count}</span>
    </button>
  );
};
