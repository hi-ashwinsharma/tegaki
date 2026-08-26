import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const getInitials = (n: string) => {
    if (!n) return 'W';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  if (src && !imageError) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
        style={{
          border: '1px solid var(--color-border-soft)',
          backgroundColor: 'var(--color-bg-surface)',
        }}
      >
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex-shrink-0 flex items-center justify-center font-semibold select-none ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-subtle)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-soft)',
      }}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
