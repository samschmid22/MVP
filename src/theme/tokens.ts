export const theme = {
  colors: {
    background: '#F7F9FE',
    surface: '#FFFFFF',
    text: '#10243E',
    muted: '#64748B',
    border: '#DEE6F3',
    primary: '#3B82F6',
    accentPink: '#EC6FAF',
    accentYellow: '#F6C150',
    success: '#27B39A',
    pastelBlue: '#EAF2FF',
    pastelPink: '#FDEEF7',
    pastelYellow: '#FFF7E8',
    pastelTeal: '#EAF9F6',
    tabBar: 'rgba(247,250,255,0.95)',
  },
  gradients: {
    brand: ['#5E93F7', '#EB82B7'] as const,
    wash: ['rgba(236,111,175,0.14)', 'rgba(59,130,246,0.14)', 'rgba(246,193,80,0.1)'] as const,
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
      shadowColor: '#10243E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: '#10243E',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    tabBar: {
      shadowColor: '#10243E',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 16,
    },
  },
  typography: {
    display: { fontSize: 30, lineHeight: 36, fontWeight: '700' as const },
    h1: { fontSize: 24, lineHeight: 30, fontWeight: '600' as const },
    h2: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
    body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
    small: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
    micro: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
    button: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
  },
  category: {
    Mobility: '#3B82F6',
    Posture: '#EC6FAF',
    Stability: '#F6C150',
    Balance: '#27B39A',
    Warmup: '#3B82F6',
    Cooldown: '#EC6FAF',
  },
};

export const getPastelByCategory = (category: keyof typeof theme.category) => {
  switch (category) {
    case 'Mobility':
    case 'Warmup':
      return theme.colors.pastelBlue;
    case 'Posture':
    case 'Cooldown':
      return theme.colors.pastelPink;
    case 'Stability':
      return theme.colors.pastelYellow;
    case 'Balance':
      return theme.colors.pastelTeal;
    default:
      return theme.colors.pastelBlue;
  }
};
