import { theme as tokens, getPastelByCategory } from './theme/tokens';

export { getPastelByCategory };

export const theme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    bg: tokens.colors.bg,
    surface: tokens.colors.surface,
    surfaceAlt: tokens.colors.surface2,
    text: tokens.colors.text,
    subtext: tokens.colors.muted,
    border: tokens.colors.stroke,
    background: tokens.colors.bg,
    card: tokens.colors.surface,
    primary: tokens.colors.brandBlue,
    accentPurple: tokens.colors.brandPurple,
    accentPink: tokens.colors.brandPink,
    tabBar: tokens.colors.tabBarGlass,
    shadow: '#131A2E',
  },
  gradients: {
    ...tokens.gradients,
    hero: tokens.gradients.brandSoft,
    premium: tokens.gradients.brand,
    cardBluePink: [tokens.colors.tintBlue, tokens.colors.tintPink] as const,
  },
  radius: tokens.radii,
  shadow: tokens.shadows,
  type: {
    h1: tokens.typography.h1,
    h2: tokens.typography.h2,
    title: tokens.typography.title,
    subtitle: tokens.typography.title,
    body: tokens.typography.body,
    caption: tokens.typography.small,
  },
};
