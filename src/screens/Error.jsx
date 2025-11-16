import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat } from 'react-native-reanimated';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';
import GlobalFooter from '../components/GlobalFooter';
import { Ionicons } from '@expo/vector-icons';

const AnimatedView = require('react-native-reanimated').default.View;
const AnimatedText = require('react-native-reanimated').default.Text;

export default function Error() {
  const navigation = useNavigation();
  const route = useRoute();
  const error = route.params?.error || {};
  const formData = route.params?.formData || {};

  const errorMessage = error.message || error.error?.message || 'An unexpected error occurred';
  const errorDetails = error.response?.data?.error?.message || error.error?.message || errorMessage;

  // Animation values
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Shake animation for icon
    iconScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    iconRotation.value = withRepeat(
      withTiming(10, { duration: 100 }),
      4,
      true
    );

    // Content entrance
    contentOpacity.value = withTiming(1, { duration: 600 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

    // Button entrance
    buttonOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const content = (
    <View style={styles.content}>
      <AnimatedView style={[styles.iconContainer, iconStyle]}>
        <View style={styles.iconCircle}>
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
        </View>
      </AnimatedView>
      
      <AnimatedView style={contentStyle}>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.subtitle}>
          We encountered an error while processing your request
        </Text>

        <AnimatedCard variant="elevated" delay={200} style={styles.errorCard}>
          <Text style={styles.errorTitle}>Error Details</Text>
          <Text style={styles.errorMessage}>{errorDetails}</Text>
          
          {error.response?.status && (
            <View style={styles.statusContainer}>
              <Text style={styles.errorCode}>
                Status Code: {error.response.status}
              </Text>
            </View>
          )}
        </AnimatedCard>

        <AnimatedView style={buttonStyle}>
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Go Back to Form"
              onPress={() => navigation.navigate('InputForm', { formData })}
              variant="primary"
              icon="arrow-back"
              iconPosition="left"
              style={styles.button}
            />

            <AnimatedButton
              title="Return to Home"
              onPress={() => navigation.navigate('Home')}
              variant="secondary"
              icon="home"
              iconPosition="left"
              style={styles.button}
            />
          </View>
        </AnimatedView>
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
      colors={['#E3F2FD', '#BBDEFB', '#FEE2E2']}
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
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  errorCard: {
    width: '100%',
    marginBottom: 32,
    padding: 0,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  errorCode: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
