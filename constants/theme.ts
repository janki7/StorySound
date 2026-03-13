export const LIGHT_COLORS = {
  background: '#F5F5F0',
  surface: '#FFFFFF',
  surfaceAlt: '#E8E6E0',
  surfaceAlt2: '#D8D6D0',
  border: '#D0CEC8',
  textPrimary: '#1A1B20',
  textSecondary: '#5A5850',
  textMuted: '#8A8780',
  accent: '#F5A623',
  accentOnAccent: '#1A1B20',
  accentBg: 'rgba(245,166,35,0.15)',
  accentBgSubtle: 'rgba(245,166,35,0.08)',
  tabBarInactive: '#9E9B93',
};

export const DARK_COLORS = {
  background: '#0F1014',
  surface: '#1A1B20',
  surfaceAlt: '#242530',
  surfaceAlt2: '#2A2B30',
  border: '#2A2B30',
  textPrimary: '#F0EFE9',
  textSecondary: '#6B6866',
  textMuted: '#8A8780',
  accent: '#F5A623',
  accentOnAccent: '#1A1B20',
  accentBg: 'rgba(245,166,35,0.15)',
  accentBgSubtle: 'rgba(245,166,35,0.08)',
  tabBarInactive: '#9E9B93',
};

export type ThemeColors = typeof DARK_COLORS & { isDark: boolean };
