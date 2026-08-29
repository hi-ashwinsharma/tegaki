import { createContext } from 'react';
import type { ThemeMode } from '../types/theme';

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode, event?: React.MouseEvent | MouseEvent) => void;
  themes: { id: ThemeMode; name: string; desc: string; previewBg: string; previewBorder: string }[];
}

export const THEMES: { id: ThemeMode; name: string; desc: string; previewBg: string; previewBorder: string }[] = [
  { id: 'white', name: 'Pure White', desc: 'Minimal clean crisp', previewBg: '#FFFFFF', previewBorder: '#E6E6E6' },
  { id: 'off-white', name: 'Paper Ivory', desc: 'Eye comfort parchment', previewBg: '#FBF9F5', previewBorder: '#E4DFD7' },
  { id: 'dark-gray', name: 'Medium Dark', desc: 'Refined editorial dark', previewBg: '#242424', previewBorder: '#383838' },
  { id: 'amoled', name: 'AMOLED Black', desc: 'Pure midnight black', previewBg: '#000000', previewBorder: '#202020' },
];

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
