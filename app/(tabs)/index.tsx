// app/(tabs)/index.tsx
import { StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Text } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function HomeScreen() {
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.text, { color: textColor }]}>
        File Navigator Coming Soon
      </Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
