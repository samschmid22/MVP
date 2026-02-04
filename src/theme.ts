import { theme as tokens, getPastelByCategory } from './theme/tokens';

export { getPastelByCategory };

export const theme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    card: tokens.colors.surface,
    accentTeal: tokens.colors.success,
    shadow: '#10243E',
  },
  gradients: {
    ...tokens.gradients,
    hero: tokens.gradients.brand,
    premium: tokens.gradients.brand,
    cardBluePink: [tokens.colors.pastelBlue, tokens.colors.pastelPink] as const,
  },
  radius: tokens.radii,
  shadow: tokens.shadows,
  type: {
    h1: tokens.typography.h1,
    h2: tokens.typography.h2,
    title: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
    subtitle: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
    body: tokens.typography.body,
    caption: tokens.typography.small,
  },
};
