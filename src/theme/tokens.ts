import { typography } from './typography';

export const theme = {
  colors: {
    bg: '#F6F7FD',
    surface: '#FFFFFF',
    surface2: '#F1F3FE',
    text: '#131A2E',
    muted: '#6B7290',
    stroke: '#DFE3F6',
    brandBlue: '#4F8BFF',
    brandPurple: '#7C5CFF',
    brandPink: '#FF5DA8',
    tabBarGlass: 'rgba(255,255,255,0.88)',
    tintBlue: '#EAF1FF',
    tintPurple: '#F1ECFF',
    tintPink: '#FEEAF4',
  },
  gradients: {
    brand: ['#4F8BFF', '#7C5CFF', '#FF5DA8'] as const,
    brandSoft: ['rgba(79,139,255,0.12)', 'rgba(124,92,255,0.12)', 'rgba(255,93,168,0.12)'] as const,
    wash: ['rgba(79,139,255,0.08)', 'rgba(124,92,255,0.08)', 'rgba(255,93,168,0.08)'] as const,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 999,
  },
  shadows: {
    card: {
      shadowColor: '#131A2E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: '#131A2E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    tabBar: {
      shadowColor: '#131A2E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 14,
    },
  },
  typography,
  category: {
    Mobility: '#4F8BFF',
    Posture: '#FF5DA8',
    Stability: '#7C5CFF',
    Balance: '#4F8BFF',
    Warmup: '#7C5CFF',
    Cooldown: '#FF5DA8',
  },
};

export const getPastelByCategory = (category: keyof typeof theme.category) => {
  switch (category) {
    case 'Mobility':
    case 'Balance':
      return theme.colors.tintBlue;
    case 'Stability':
    case 'Warmup':
      return theme.colors.tintPurple;
    case 'Posture':
    case 'Cooldown':
      return theme.colors.tintPink;
    default:
      return theme.colors.tintBlue;
  }
};
