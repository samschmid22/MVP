import { typography } from './typography';

export const theme = {
  colors: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surface2: '#F6F7FB',
    text: '#0B0F18',
    muted: '#5B667A',
    stroke: '#E6E8F0',
    brandBlue: '#3B82F6',
    brandPurple: '#8B5CF6',
    brandPink: '#EC4899',
    tabBarGlass: 'rgba(255,255,255,0.88)',
    tintBlue: '#EAF2FE',
    tintPurple: '#F3ECFF',
    tintPink: '#FCEAF4',
  },
  gradients: {
    brand: ['#3B82F6', '#8B5CF6', '#EC4899'] as const,
    brandSoft: ['rgba(59,130,246,0.12)', 'rgba(139,92,246,0.12)', 'rgba(236,72,153,0.12)'] as const,
    wash: ['rgba(59,130,246,0.08)', 'rgba(139,92,246,0.08)', 'rgba(236,72,153,0.08)'] as const,
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
      shadowColor: '#0B0F18',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: '#0B0F18',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 2,
    },
    tabBar: {
      shadowColor: '#0B0F18',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 14,
    },
  },
  typography,
  category: {
    Mobility: '#3B82F6',
    Posture: '#EC4899',
    Stability: '#8B5CF6',
    Balance: '#3B82F6',
    Warmup: '#8B5CF6',
    Cooldown: '#EC4899',
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
