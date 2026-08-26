export type ThemeMode = 'white' | 'off-white' | 'dark-gray' | 'amoled';

export interface ThemeColors {
  id: ThemeMode;
  name: string;
  description: string;
  bg: string;
  bgSurface: string;
  bgSubtle: string;
  borderSoft: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentHover: string;
  codeBg: string;
}
