import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import ComsolLogo from './ComsolLogo';

const AnimatedView = require('react-native-reanimated').default.View;
const AnimatedTouchableOpacity = require('react-native-reanimated').default.createAnimatedComponent(TouchableOpacity);

export default function GlobalFooter() {
  const opacity = useSharedValue(0.6);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(0.7, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    opacity.value = withTiming(1, { duration: 200 });
    setTimeout(() => {
      opacity.value = withTiming(0.7, { duration: 200 });
    }, 200);
  };

  return (
    <AnimatedView style={[styles.footer, animatedStyle]}>
      <AnimatedTouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.footerContent}
      >
        <Text style={styles.poweredBy}>Powered by</Text>
        <View style={styles.logoContainer}>
          <ComsolLogo width={80} height={24} opacity={1} />
        </View>
      </AnimatedTouchableOpacity>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 1000,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  poweredBy: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  logoContainer: {
    marginLeft: 4,
  },
});

