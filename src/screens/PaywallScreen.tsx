import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { RootStackParamList } from '../navigation/types';
import { mockPurchasePremium } from '../services/purchaseService';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export const PaywallScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <Screen>
      <LinearGradient colors={theme.gradients.premium} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <Text style={styles.title}>Bend Premium</Text>
        <Text style={styles.price}>$9.99 / month (stub)</Text>
        <Text style={styles.feature}>- Type any exercise name and auto-create cartoon media</Text>
        <Text style={styles.feature}>- Unlimited custom exercise generation</Text>
        <Text style={styles.feature}>- Priority new animation packs</Text>

        <Pressable
          style={styles.buyButton}
          onPress={async () => {
            setLoading(true);
            await mockPurchasePremium();
            setLoading(false);
            navigation.replace('Premium');
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buyText}>Unlock Premium</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Not now</Text>
        </Pressable>
      </LinearGradient>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 40,
    borderRadius: 22,
    padding: 20,
    gap: 10,
    ...theme.shadow.card,
  },
  title: { color: '#fff', fontWeight: '900', fontSize: 30 },
  price: { color: '#FDE68A', fontWeight: '800', marginBottom: 8 },
  feature: { color: '#F8FAFC', fontWeight: '600' },
  buyButton: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buyText: { color: '#fff', fontWeight: '800' },
  cancelText: { color: '#E2E8F0', textAlign: 'center', marginTop: 8, fontWeight: '700' },
});
