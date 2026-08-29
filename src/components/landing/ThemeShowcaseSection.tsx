import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeMode } from '../../types/theme';

export const ThemeShowcaseSection: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16 text-center"
      style={{
        borderTop: '1px solid var(--color-border-soft)',
        borderBottom: '1px solid var(--color-border-soft)',
        backgroundColor: 'var(--color-bg-subtle)',
      }}
    >
      <div className="max-w-4xl mx-auto w-full space-y-10">
        <div className="space-y-3 max-w-xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Four Calibrated Reading Themes
          </h2>
          <p className="text-xs sm:text-sm font-serif" style={{ color: 'var(--color-text-secondary)' }}>
            Click any canvas below to experience the smooth circular reveal transition across the entire platform.
          </p>
        </div>

        {/* 4 Visual Mini-Canvas Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((t) => {
            const active = theme === t.id;
            const isDarkTheme = t.id === 'dark-gray' || t.id === 'amoled';

            return (
              <div
                key={t.id}
                onClick={(e) => setTheme(t.id as ThemeMode, e)}
                className="p-5 rounded-2xl text-left cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98] select-none flex flex-col justify-between h-56"
                style={{
                  backgroundColor: t.previewBg,
                  border: active ? '2px solid var(--color-accent)' : `1px solid ${t.previewBorder}`,
                  color: isDarkTheme ? '#EFEFEF' : '#1F1F1F',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif">{t.name}</span>
                    {active && <Check size={14} style={{ color: 'var(--color-accent)' }} />}
                  </div>

                  <div
                    className="p-2.5 rounded-lg text-[11px] font-editorial space-y-1.5"
                    style={{
                      backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="font-bold text-xs">A quiet evening...</div>
                    <div className="opacity-75 text-[10px] line-clamp-2 leading-relaxed">
                      The ink settles into the grain of the page without noise.
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] opacity-60 font-mono flex items-center justify-between">
                  <span>{t.desc}</span>
                  <span className="font-bold">{active ? 'ACTIVE' : 'APPLY'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
