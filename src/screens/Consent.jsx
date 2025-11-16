import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';
import GlobalFooter from '../components/GlobalFooter';
import { Ionicons } from '@expo/vector-icons';

const AnimatedView = require('react-native-reanimated').default.View;

export default function Consent() {
  const navigation = useNavigation();
  const [agreed, setAgreed] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    cardOpacity.value = withTiming(1, { duration: 600 });
    buttonOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleContinue = () => {
    if (agreed) {
      navigation.navigate('InputForm');
    }
  };

  const Container = Platform.OS === 'web' ? View : LinearGradient;
  const containerProps = Platform.OS === 'web' 
    ? { style: [styles.container, { backgroundColor: '#E3F2FD' }] }
    : { colors: ['#E3F2FD', '#BBDEFB'], style: styles.container };

  return (
    <Container {...containerProps}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AnimatedView style={headerStyle}>
          <AnimatedCard variant="elevated" style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={32} color="#1976D2" />
              </View>
              <Text style={styles.title}>Privacy & Data Usage</Text>
              <Text style={styles.subtitle}>
                Your privacy is important to us. Please review before continuing.
              </Text>
            </View>

            <AnimatedView style={cardStyle}>
              <View style={styles.privacySection}>
                {[
                  { icon: 'server', color: '#1976D2', bg: '#DBEAFE', title: 'What We Collect', text: 'We collect your building specifications (size, insulation, HVAC type), occupancy schedule, location (ZIP code only), and optional utility cost information to calculate personalized HVAC recommendations.' },
                  { icon: 'eye', color: '#10b981', bg: '#D1FAE5', title: 'How We Use Your Data', text: 'Your data is used only to perform physics-based calculations for your HVAC optimization. We analyze thermal properties to provide personalized energy-saving recommendations.' },
                  { icon: 'lock-closed', color: '#9333EA', bg: '#F3E8FF', title: 'Data Protection', text: 'Your information is processed securely and is never sold or shared with third parties. We do not store personally identifiable information beyond your session.' },
                ].map((item, index) => (
                  <AnimatedCard key={index} variant="outlined" delay={100 * (index + 1)} style={styles.privacyItemCard}>
                    <View style={styles.privacyItem}>
                      <View style={[styles.privacyIcon, { backgroundColor: item.bg }]}>
                        <Ionicons name={item.icon} size={20} color={item.color} />
                      </View>
                      <View style={styles.privacyContent}>
                        <Text style={styles.privacyTitle}>{item.title}</Text>
                        <Text style={styles.privacyText}>{item.text}</Text>
                      </View>
                    </View>
                  </AnimatedCard>
                ))}

                <AnimatedCard variant="outlined" delay={400} style={styles.infoBoxGreen}>
                  <Text style={styles.infoBoxTitleGreen}>✓ What We DON'T Do</Text>
                  <View style={styles.bulletList}>
                    {[
                      "We don't collect your name, email, or phone number",
                      "We don't store your exact address (only ZIP code)",
                      "We don't sell your data to third parties",
                      "We don't track you across other websites",
                      "We don't require account creation or login",
                    ].map((item, index) => (
                      <Text key={index} style={styles.bulletItem}>• {item}</Text>
                    ))}
                  </View>
                </AnimatedCard>

                <AnimatedCard variant="outlined" delay={500} style={styles.infoBoxYellow}>
                  <Text style={styles.infoBoxTitleYellow}>⚠️ Be Aware</Text>
                  <Text style={styles.infoBoxTextYellow}>
                    Your occupancy schedule reveals when you're away from home. While we protect this data, 
                    please ensure you're using a secure internet connection and trusted device.
                  </Text>
                </AnimatedCard>
              </View>

              <View style={styles.consentSection}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAgreed(!agreed)}
                >
                  <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                    {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                  <Text style={styles.consentText}>
                    I understand and consent to THERMSOL.ai using my building and schedule data 
                    to calculate personalized HVAC recommendations. I acknowledge that my data will be 
                    processed securely and not shared with third parties.
                  </Text>
                </TouchableOpacity>
              </View>

              <AnimatedView style={buttonStyle}>
                <View style={styles.buttonContainer}>
                  <AnimatedButton
                    title="Go Back"
                    onPress={() => navigation.navigate('Home')}
                    variant="secondary"
                    style={styles.button}
                  />
                  <AnimatedButton
                    title="Continue to Survey"
                    onPress={handleContinue}
                    variant="primary"
                    icon="arrow-forward"
                    iconPosition="right"
                    disabled={!agreed}
                    style={styles.button}
                  />
                </View>
              </AnimatedView>

              <Text style={styles.footerNote}>
                By continuing, you agree to our data usage practices as described above. 
                You can exit at any time, and your data will not be saved.
              </Text>
            </AnimatedView>
          </AnimatedCard>
        </AnimatedView>
      </ScrollView>
      <GlobalFooter />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  card: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    padding: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  privacySection: {
    marginBottom: 24,
    gap: 16,
    paddingHorizontal: 24,
  },
  privacyItemCard: {
    padding: 0,
  },
  privacyItem: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  infoBoxGreen: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10b981',
    padding: 16,
  },
  infoBoxTitleGreen: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  bulletList: {
    gap: 4,
  },
  bulletItem: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  infoBoxYellow: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
    padding: 16,
  },
  infoBoxTitleYellow: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  infoBoxTextYellow: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  consentSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  button: {
    flex: 1,
  },
  footerNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
