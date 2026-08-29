import React, { useEffect, useState } from 'react';
import type { ThemeMode } from '../types/theme';
import { ThemeContext, THEMES } from './themeContextState';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tegaki_theme_mode') as ThemeMode;
    return saved && ['white', 'off-white', 'dark-gray', 'amoled'].includes(saved) ? saved : 'white';
  });

  const setTheme = (newTheme: ThemeMode, event?: React.MouseEvent | MouseEvent) => {
    if (newTheme === theme) return;

    if (event) {
      const x = event.clientX;
      const y = event.clientY;
      document.documentElement.style.setProperty('--theme-x', `${x}px`);
      document.documentElement.style.setProperty('--theme-y', `${y}px`);
    } else {
      document.documentElement.style.setProperty('--theme-x', '50%');
      document.documentElement.style.setProperty('--theme-y', '50%');
    }

    // Modern View Transitions API for Circle Reveal animation
    if (
      'startViewTransition' in document &&
      typeof (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition === 'function'
    ) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setThemeState(newTheme);
        localStorage.setItem('tegaki_theme_mode', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      });
    } else {
      setThemeState(newTheme);
      localStorage.setItem('tegaki_theme_mode', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};
