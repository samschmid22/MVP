import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { configureAudio } from './src/services/cueService';
import { configureRevenueCat } from './src/services/purchaseService';
import { useAppStore } from './src/storage/appStore';
import { colors } from './src/utils/theme';

export default function App() {
  const hydrated = useAppStore((state) => state.hydrated);
  const initializeData = useAppStore((state) => state.initializeData);

  useEffect(() => {
    void configureAudio();
    void configureRevenueCat();
  }, []);

  useEffect(() => {
    if (hydrated) {
      initializeData();
    }
  }, [hydrated, initializeData]);

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
