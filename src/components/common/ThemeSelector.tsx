import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../types/theme';

export const ThemeSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Switch Theme"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer"
          style={{
            border: '1px solid var(--color-border-soft)',
            backgroundColor: 'var(--color-bg-surface)',
          }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: themes.find((t) => t.id === theme)?.previewBg,
              border: '1px solid var(--color-border-hover)',
            }}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div
              className="absolute left-10 bottom-0 z-50 py-2 w-48 rounded-md"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              <div className="px-3 py-1.5 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                Theme / Appearance
              </div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as ThemeMode);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors cursor-pointer"
                  style={{
                    backgroundColor: theme === t.id ? 'var(--color-bg-subtle)' : 'transparent',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block"
                      style={{
                        backgroundColor: t.previewBg,
                        border: `1px solid ${t.previewBorder}`,
                      }}
                    />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.id && (
                    <span className="text-xs font-mono" style={{ color: 'var(--color-accent)' }}>
                      active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
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
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id as ThemeMode)}
          title={`${t.name} - ${t.desc}`}
          className="px-2.5 py-1 text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
          style={{
            backgroundColor: theme === t.id ? 'var(--color-bg)' : 'transparent',
            border: theme === t.id ? '1px solid var(--color-border-soft)' : '1px solid transparent',
            color: theme === t.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            fontWeight: theme === t.id ? 600 : 400,
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: t.previewBg,
              border: `1px solid ${t.previewBorder}`,
            }}
          />
          <span className="hidden sm:inline">{t.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  );
};
