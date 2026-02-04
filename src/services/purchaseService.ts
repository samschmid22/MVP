import { useAppStore } from '../storage/appStore';

export const configureRevenueCat = async () => {
  // TODO: plug real RevenueCat SDK setup here using EXPO_PUBLIC_REVENUECAT_API_KEY.
  // Keep this stub so the app runs without paid services.
  const key = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  if (!key) return;
};

export const mockPurchasePremium = async () => {
  // TODO: replace this with a real RevenueCat purchase flow.
  useAppStore.getState().setPremium(true);
  return { success: true };
};
