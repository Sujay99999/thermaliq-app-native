import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AnimatedTouchableOpacity = require('react-native-reanimated').default.createAnimatedComponent(TouchableOpacity);

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  useEffect(() => {
    if (disabled) {
      opacity.value = withTiming(0.5, { duration: 200 });
    } else {
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [disabled]);

  const gradientColors = {
    primary: ['#1976D2', '#42A5F5'],
    success: ['#10b981', '#059669'],
    warning: ['#F59E0B', '#D97706'],
    secondary: ['#6B7280', '#9CA3AF'],
  };

  const colors = gradientColors[variant] || gradientColors.primary;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />
      )}
      <Text style={[styles.text, textStyle]}>{title}</Text>
      {icon && iconPosition === 'right' && (
        <Ionicons name={icon} size={20} color="#fff" style={{ marginLeft: 8 }} />
      )}
    </>
  );

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.container, fullWidth && styles.fullWidth, style, animatedStyle]}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {content}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

