import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeMode } from '../types/theme';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: { id: ThemeMode; name: string; desc: string; previewBg: string; previewBorder: string }[];
}

const THEMES: { id: ThemeMode; name: string; desc: string; previewBg: string; previewBorder: string }[] = [
  { id: 'white', name: 'Pure White', desc: 'Minimal clean crisp', previewBg: '#FFFFFF', previewBorder: '#E6E6E6' },
  { id: 'off-white', name: 'Paper Ivory', desc: 'Eye comfort parchment', previewBg: '#FBF9F5', previewBorder: '#E4DFC' },
  { id: 'dark-gray', name: 'Medium Dark', desc: 'Refined editorial dark', previewBg: '#242424', previewBorder: '#383838' },
  { id: 'amoled', name: 'AMOLED Black', desc: 'Pure midnight black', previewBg: '#000000', previewBorder: '#202020' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tegaki_theme_mode') as ThemeMode;
    return saved && ['white', 'off-white', 'dark-gray', 'amoled'].includes(saved) ? saved : 'off-white';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('tegaki_theme_mode', newTheme);
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
