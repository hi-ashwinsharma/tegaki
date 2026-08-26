import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../types/theme';
import { Check, SunMedium, Moon } from 'lucide-react';

export const ThemeSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
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
            className="absolute left-10 bottom-0 z-50 py-2 w-52 rounded-lg select-none animate-fade-in"
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
                  onClick={() => {
                    setTheme(t.id as ThemeMode);
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
            onClick={() => setTheme(t.id as ThemeMode)}
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
