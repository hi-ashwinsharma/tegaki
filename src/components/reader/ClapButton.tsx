import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ClapButtonProps {
  count: number;
  onClap: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ClapButton: React.FC<ClapButtonProps> = ({ count, onClap }) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    onClap();
    setTimeout(() => setAnimating(false), 250);
  };

  return (
    <button
      onClick={handleClick}
      title="Applaud story"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-transform cursor-pointer select-none ${
        animating ? 'scale-110' : 'hover:scale-105 active:scale-95'
      }`}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-soft)',
        color: count > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      }}
    >
      <Sparkles
        size={16}
        strokeWidth={1.8}
      />
      <span className="text-xs font-mono font-medium">{count}</span>
    </button>
  );
};
