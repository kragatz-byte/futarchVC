export const palette = {
  background: '#071A33',
  card: '#FFFFFF',
  offWhite: '#F4F7FB',
  surface: '#0C2447',
  surfaceElevated: '#12335C',
  accent: '#3B82F6',
  accentMuted: 'rgba(59, 130, 246, 0.14)',
  cute: '#C4B5FD',
  cuteMuted: 'rgba(196, 181, 253, 0.22)',
  cuteBorder: 'rgba(196, 181, 253, 0.45)',
  muted: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  risk: '#EF4444',
  white: '#FFFFFF',
} as const;

export const navy = {
  900: '#071A33',
  800: '#0C2447',
  700: '#12335C',
  600: '#1A4478',
  500: '#2563A8',
} as const;

export const text = {
  primary: '#071A33',
  inverse: '#FFFFFF',
  inverseMuted: 'rgba(255, 255, 255, 0.68)',
  inverseSubtle: 'rgba(255, 255, 255, 0.45)',
  muted: '#64748B',
  onAccent: '#FFFFFF',
} as const;

export const border = {
  light: '#E8EDF4',
  subtle: '#F1F5F9',
  dark: 'rgba(255, 255, 255, 0.1)',
  accent: 'rgba(59, 130, 246, 0.35)',
} as const;

export type PaletteColor = keyof typeof palette;
export type SemanticTextColor = keyof typeof text;

export const navigationColors = {
  light: {
    text: text.primary,
    background: palette.offWhite,
    tint: palette.accent,
    tabIconDefault: palette.muted,
    tabIconSelected: palette.accent,
    card: palette.card,
  },
  dark: {
    text: text.inverse,
    background: palette.background,
    tint: palette.accent,
    tabIconDefault: text.inverseMuted,
    tabIconSelected: palette.accent,
    card: palette.card,
  },
} as const;

export default navigationColors;
