import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../types/theme';
import { Check, SunMedium, Moon } from 'lucide-react';

interface ThemeSelectorProps {
  compact?: boolean;
  placement?: 'bottom-right' | 'sidebar';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  compact = false,
  placement = 'bottom-right',
}) => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const isDark = theme === 'dark-gray' || theme === 'amoled';

  if (compact) {
    const dropdownPositionClasses =
      placement === 'sidebar'
        ? 'bottom-full mb-3 -left-20 sm:-left-16 md:left-12 md:bottom-0 md:mb-0'
        : 'right-0 top-full mt-2';

    return (
      <div className="relative" ref={containerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Change reading theme"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer"
          style={{
            border: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {isDark ? <Moon size={15} strokeWidth={1.75} /> : <SunMedium size={15} strokeWidth={1.75} />}
        </button>

        {isOpen && (
          <div
            className={`absolute z-50 py-2 w-52 rounded-xl select-none animate-fade-in ${dropdownPositionClasses}`}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
              Theme Palette
            </div>
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={(e) => {
                    setTheme(t.id as ThemeMode, e);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer"
                  style={{
                    backgroundColor: active ? 'var(--color-bg-subtle)' : 'transparent',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block flex-shrink-0"
                      style={{
                        backgroundColor: t.previewBg,
                        border: `1px solid ${t.previewBorder}`,
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        {t.desc}
                      </span>
                    </div>
                  </div>
                  {active && <Check size={14} style={{ color: 'var(--color-accent)' }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center p-1 rounded-full gap-1"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-soft)',
      }}
    >
      {themes.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={(e) => setTheme(t.id as ThemeMode, e)}
            title={`${t.name} — ${t.desc}`}
            className="px-3 py-1 text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            style={{
              backgroundColor: active ? 'var(--color-bg)' : 'transparent',
              border: active ? '1px solid var(--color-border-soft)' : '1px solid transparent',
              color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontWeight: active ? 600 : 400,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: t.previewBg,
                border: `1px solid ${t.previewBorder}`,
              }}
            />
            <span>{t.name.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
};
