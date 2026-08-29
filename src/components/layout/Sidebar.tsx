import React, { useState, useRef, useEffect } from 'react';
import { CircularLogoIcon } from '../common/Icons';
import { ThemeSelector } from '../common/ThemeSelector';
import { UserAvatar } from '../common/UserAvatar';
import { useAuth } from '../../hooks/useAuth';


import { Home, Feather, User, LogOut } from 'lucide-react';

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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isProfileMenuOpen]);

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 h-16 w-full flex flex-row items-center justify-around px-4 py-2 z-30 select-none md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-20 md:h-auto md:flex-col md:items-center md:justify-between md:py-6 md:px-0"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border-soft)',
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          aside {
            border-top: none !important;
            border-right: 1px solid var(--color-border-soft) !important;
          }
        }
      `}</style>

      {/* Desktop Logo / Top section */}
      <div className="hidden md:flex flex-col items-center gap-6">
        <button
          onClick={() => onNavigate('home')}
          title="Tegaki Home"
          className="p-2 rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <CircularLogoIcon size={30} />
        </button>

        {/* Desktop Navigation items */}
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

      {/* Mobile-only Nav items */}
      <div className="flex md:hidden items-center justify-around w-full">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          title="Home"
          className="p-3 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          style={{
            color: currentView === 'home' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            backgroundColor: currentView === 'home' ? 'var(--color-bg-subtle)' : 'transparent',
          }}
        >
          <Home size={21} strokeWidth={currentView === 'home' ? 2.2 : 1.6} />
        </button>

        {/* Write */}
        <button
          onClick={() => onNavigate('writer')}
          title="Write story"
          className="p-3 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          style={{
            color: currentView === 'writer' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            backgroundColor: currentView === 'writer' ? 'var(--color-bg-subtle)' : 'transparent',
          }}
        >
          <Feather size={21} strokeWidth={currentView === 'writer' ? 2.2 : 1.6} />
        </button>

        {/* Theme Selector */}
        <div className="flex items-center justify-center">
          <ThemeSelector compact placement="sidebar" />
        </div>

        {/* Profile / Sign In */}
        {isAuthenticated && user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title={user.name}
              className="rounded-full transition-opacity hover:opacity-85 cursor-pointer flex items-center justify-center p-1"
            >
              <UserAvatar src={user.avatarUrl} name={user.name} size="md" />
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 bottom-full mb-3 z-50 py-3 px-3.5 w-64 rounded-xl select-none animate-fade-in"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                <div className="flex items-center gap-3 pb-3 mb-2" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
                  <UserAvatar src={user.avatarUrl} name={user.name} size="md" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {user.name}
                    </span>
                    <span className="text-[11px] font-mono truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      @{user.username}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] mb-3 truncate px-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.email}
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-2.5 text-xs font-medium rounded-md flex items-center justify-between transition-colors cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  <span>Sign out</span>
                  <LogOut size={14} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            title="Sign In"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer"
            style={{
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-soft)',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            <User size={16} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Desktop Bottom controls: Theme selector & Profile */}
      <div className="hidden md:flex flex-col items-center gap-4">
        <ThemeSelector compact placement="sidebar" />

        {isAuthenticated && user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title={user.name}
              className="rounded-full transition-opacity hover:opacity-85 cursor-pointer"
            >
              <UserAvatar src={user.avatarUrl} name={user.name} size="md" />
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileMenuOpen && (
              <div
                className="absolute left-12 bottom-0 z-50 py-3 px-3.5 w-60 rounded-xl select-none animate-fade-in"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-soft)',
                }}
              >
                <div className="flex items-center gap-3 pb-3 mb-2" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
                  <UserAvatar src={user.avatarUrl} name={user.name} size="md" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {user.name}
                    </span>
                    <span className="text-[11px] font-mono truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      @{user.username}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] mb-3 truncate px-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.email}
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-1.5 px-2.5 text-xs font-medium rounded-md flex items-center justify-between transition-colors cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-soft)',
                  }}
                >
                  <span>Sign out</span>
                  <LogOut size={13} strokeWidth={1.8} />
                </button>
              </div>
            )}
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
