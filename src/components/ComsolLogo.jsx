import { View, Text, StyleSheet } from 'react-native';

/**
 * COMSOL Logo Component
 * Simplified text-based logo matching COMSOL brand
 * In production, replace with actual COMSOL logo asset
 */
export default function ComsolLogo({ width = 100, height = 30, opacity = 0.7 }) {
  return (
    <View style={[styles.container, { width, height, opacity }]}>
      <Text style={styles.logoText}>COMSOL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    letterSpacing: 1.5,
  },
});
