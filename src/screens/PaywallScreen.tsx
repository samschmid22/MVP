import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { mockPurchasePremium } from '../services/purchaseService';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export const PaywallScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 20 },
  card: {
    borderRadius: 18,
    backgroundColor: '#111827',
    padding: 20,
    gap: 10,
  },
  title: { color: '#fff', fontWeight: '900', fontSize: 30 },
  price: { color: '#a7f3d0', fontWeight: '700', marginBottom: 8 },
  feature: { color: '#e5e7eb' },
  buyButton: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buyText: { color: '#fff', fontWeight: '800' },
  cancelText: { color: '#9ca3af', textAlign: 'center', marginTop: 8 },
});
