import React from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { useAuth } from '../../context/AuthContext';
import { Home, Feather, User } from 'lucide-react';

interface SidebarProps {
  currentView: 'home' | 'writer' | 'reader' | 'landing';
  onNavigate: (view: 'home' | 'writer' | 'landing') => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-16 md:w-20 flex flex-col items-center justify-between py-6 z-30 select-none"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRight: '1px solid var(--color-border-soft)',
      }}
    >
      {/* Top circular minimal vector logo */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => onNavigate('home')}
          title="Tegaki Home"
          className="p-2 rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <CircularLogoIcon size={30} />
        </button>

        {/* Navigation items */}
        <nav className="flex flex-col items-center gap-4 mt-2">
          {/* Rounded Home Icon */}
          <button
            onClick={() => onNavigate('home')}
            title="Stories & Journals"
            className="p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
            style={{
              color: currentView === 'home' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              backgroundColor: currentView === 'home' ? 'var(--color-bg-subtle)' : 'transparent',
              border: currentView === 'home' ? '1px solid var(--color-border-soft)' : '1px solid transparent',
            }}
          >
            <Home size={19} strokeWidth={currentView === 'home' ? 2.2 : 1.6} />
          </button>

          {/* Feather Quill (Writer Icon) */}
          <button
            onClick={() => onNavigate('writer')}
            title="Write / New Journal"
            className="p-2.5 rounded-xl transition-colors flex items-center justify-center relative group cursor-pointer"
            style={{
              color: currentView === 'writer' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              backgroundColor: currentView === 'writer' ? 'var(--color-bg-subtle)' : 'transparent',
              border: currentView === 'writer' ? '1px solid var(--color-border-soft)' : '1px solid transparent',
            }}
          >
            <Feather size={19} strokeWidth={currentView === 'writer' ? 2.2 : 1.6} />
            <span
              className="absolute left-16 px-2.5 py-1 text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 font-sans"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
                color: 'var(--color-text-primary)',
              }}
            >
              Write story
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom controls: Theme selector & Profile */}
      <div className="flex flex-col items-center gap-4">
        <ThemeSelector compact />

        {isAuthenticated && user ? (
          <div className="relative group">
            <button
              onClick={() => logout()}
              title={`${user.name} — Click to sign out`}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
              style={{
                border: '1px solid var(--color-border-soft)',
                backgroundColor: 'var(--color-bg-surface)',
              }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            title="Sign In"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer"
            style={{
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-soft)',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            <User size={15} strokeWidth={1.75} />
          </button>
        )}
      </div>
    </aside>
  );
};
