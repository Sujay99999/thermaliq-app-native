import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, withRepeat } from 'react-native-reanimated';
import AnimatedButton from '../components/AnimatedButton';
import GlobalFooter from '../components/GlobalFooter';
import { Ionicons } from '@expo/vector-icons';

const AnimatedView = require('react-native-reanimated').default.View;
const AnimatedText = require('react-native-reanimated').default.Text;

export default function Home() {
  const navigation = useNavigation();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animations
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 100 }));

    subtitleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));

    buttonOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    buttonScale.value = withDelay(500, withSpring(1, { damping: 12, stiffness: 150 }));

    // Continuous subtle icon rotation
    iconRotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const content = (
    <View style={styles.content}>
      {/* Animated Icon */}
      <AnimatedView style={[styles.iconContainer, iconStyle]}>
        <View style={styles.iconCircle}>
          <Ionicons name="snow" size={48} color="#1976D2" />
        </View>
      </AnimatedView>

      {/* Title */}
      <AnimatedText style={[styles.title, titleStyle]}>
        THERMSOL.ai
      </AnimatedText>

      {/* Subtitle */}
      <AnimatedText style={[styles.subtitle, subtitleStyle]}>
        Physics-Powered HVAC Optimization
      </AnimatedText>

      {/* Description */}
      <AnimatedView style={[styles.descriptionContainer, subtitleStyle]}>
        <Text style={styles.description}>
          Optimize your home's energy efficiency with AI-driven thermal analysis
        </Text>
      </AnimatedView>

      {/* CTA Button */}
      <AnimatedView style={buttonStyle}>
        <AnimatedButton
          title="Get Started"
          onPress={() => navigation.navigate('Consent')}
          variant="primary"
          icon="arrow-forward"
          iconPosition="right"
          style={styles.button}
        />
      </AnimatedView>

      {/* Feature Pills */}
      <AnimatedView style={[styles.featuresContainer, buttonStyle]}>
        <View style={styles.pill}>
          <Ionicons name="flash" size={16} color="#1976D2" />
          <Text style={styles.pillText}>Real-time Analysis</Text>
        </View>
        <View style={styles.pill}>
          <Ionicons name="calculator" size={16} color="#1976D2" />
          <Text style={styles.pillText}>Physics-Based</Text>
        </View>
        <View style={styles.pill}>
          <Ionicons name="trophy" size={16} color="#1976D2" />
          <Text style={styles.pillText}>Save Energy</Text>
        </View>
      </AnimatedView>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: '#E3F2FD' }]}>
        {content}
        <GlobalFooter />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {content}
      <GlobalFooter />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: '#1976D2',
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#374151',
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    minWidth: 200,
    marginBottom: 32,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
