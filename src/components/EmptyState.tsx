import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

type Props = {
  title: string;
  subtitle: string;
};

export const EmptyState = ({ title, subtitle }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.subtext,
    textAlign: 'center',
  },
});
