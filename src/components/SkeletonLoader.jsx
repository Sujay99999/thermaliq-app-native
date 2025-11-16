import { View, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

const AnimatedView = require('react-native-reanimated').default.View;

export default function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, style }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonLoader width="60%" height={24} borderRadius={8} style={{ marginBottom: 12 }} />
      <SkeletonLoader width="100%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="80%" height={16} borderRadius={6} style={{ marginBottom: 16 }} />
      <View style={styles.row}>
        <SkeletonLoader width="40%" height={40} borderRadius={8} />
        <SkeletonLoader width="40%" height={40} borderRadius={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});

