import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { calculateHVAC } from '../services/api';
import { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSpring } from 'react-native-reanimated';
import AnimatedCard from '../components/AnimatedCard';
import { SkeletonLoader, SkeletonCard } from '../components/SkeletonLoader';
import GlobalFooter from '../components/GlobalFooter';
import { Ionicons } from '@expo/vector-icons';

const AnimatedView = require('react-native-reanimated').default.View;
const AnimatedText = require('react-native-reanimated').default.Text;

export default function Loading() {
  const navigation = useNavigation();
  const route = useRoute();
  const formData = route.params?.formData || {};
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Analyzing building properties...');
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const progressOpacity = useSharedValue(0);
  const tipOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  const steps = [
    'Analyzing building properties...',
    'Calculating thermal time constant (τ)...',
    'Determining break-even time...',
    'Optimizing setback temperature...',
    'Computing your savings...'
  ];

  const tips = [
    'The average US household spends $1,900/year on energy bills.',
    'Smart HVAC strategies can save 10-20% on cooling costs.',
    'Thermal time constant determines how fast your building responds to temperature changes.',
    'Well-insulated homes can maintain temperature 3x longer than poorly insulated ones.',
    'The optimal setback depends on your building\'s unique thermal properties.'
  ];

  const [currentTip, setCurrentTip] = useState(tips[0]);

  useEffect(() => {
    // Entrance animations
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    progressOpacity.value = withTiming(1, { duration: 600 });
    tipOpacity.value = withTiming(1, { duration: 600 });

    // Rotating icon
    iconRotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const tipStyle = useAnimatedStyle(() => ({
    opacity: tipOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  useEffect(() => {
    const performCalculation = async () => {
      setShowSkeleton(false);
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 2;
        });
      }, 100);

      try {
        const normalizedFormData = normalizeFormData(formData);
        const roomData = route.params?.roomData || {};
        const result = await calculateHVAC(normalizedFormData, roomData);
        
        if (!result.success) {
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => {
            navigation.navigate('Error', {
              error: result.error || { message: 'Failed to calculate HVAC strategy' },
              formData,
            });
          }, 500);
          return;
        }
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          navigation.navigate('Results', {
            formData,
            results: result.data,
          });
        }, 500);
      } catch (error) {
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          navigation.navigate('Error', {
            error: {
              message: error.response?.data?.error?.message || error.message || 'An unexpected error occurred',
              response: error.response,
            },
            formData,
          });
        }, 500);
      }
    };

    performCalculation();
  }, [navigation, formData, route.params]);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * steps.length);
    if (stepIndex < steps.length) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [progress]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress}%`,
  }));

  const content = (
    <View style={styles.content}>
      <AnimatedView style={headerStyle}>
        <View style={styles.header}>
          <AnimatedView style={[styles.iconContainer, iconStyle]}>
            <View style={styles.iconCircle}>
              <Ionicons name="snow" size={48} color="#1976D2" />
            </View>
          </AnimatedView>
          <Text style={styles.title}>THERMSOL.ai is analyzing...</Text>
          <Text style={styles.subtitle}>Calculating your optimal HVAC strategy</Text>
        </View>
      </AnimatedView>

      {showSkeleton ? (
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
        </View>
      ) : (
        <>
          <AnimatedView style={progressStyle}>
            <AnimatedCard variant="elevated" delay={200}>
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercent}>{progress}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <AnimatedView style={[styles.progressBarFill, progressBarStyle]} />
                </View>
                <Text style={styles.currentStepText}>{currentStep}</Text>
              </View>
            </AnimatedCard>
          </AnimatedView>

          <AnimatedView style={tipStyle}>
            <AnimatedCard variant="outlined" delay={300} style={styles.tipCard}>
              <View style={styles.tipContent}>
                <Ionicons name="bulb" size={24} color="#F59E0B" style={styles.tipIcon} />
                <View style={styles.tipTextContainer}>
                  <Text style={styles.tipTitle}>💡 Did you know?</Text>
                  <Text style={styles.tipText}>{currentTip}</Text>
                </View>
              </View>
            </AnimatedCard>
          </AnimatedView>
        </>
      )}
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

// ... (keep all the normalizeFormData functions from original file)

function normalizeFormData(formData) {
  const normalized = { ...formData };
  const numericFields = ['outdoorTemp', 'desiredTemp', 'floorArea', 'absenceDuration', 'ceilingHeight', 'numFloors', 'windowAreaPercent', 'numExteriorDoors', 'seerRating', 'humidity', 'daysPerWeek', 'weeksPerYear'];
  
  numericFields.forEach(field => {
    if (normalized[field] !== undefined && normalized[field] !== null && normalized[field] !== '') {
      const numValue = Number(normalized[field]);
      if (!isNaN(numValue)) {
        normalized[field] = numValue;
      } else {
        delete normalized[field];
      }
    } else {
      delete normalized[field];
    }
  });
  
  if (normalized.electricityRate) {
    const rate = Number(normalized.electricityRate);
    if (!isNaN(rate)) {
      normalized.utilityRate = rate;
    }
    delete normalized.electricityRate;
  }
  
  if (normalized.monthlyBill) {
    const bill = Number(normalized.monthlyBill);
    if (!isNaN(bill)) {
      normalized.monthlyElectricBill = bill;
    }
    delete normalized.monthlyBill;
  }
  
  if (normalized.absenceStartTime) {
    const startTime = parseTimeString(normalized.absenceStartTime);
    if (startTime !== null) {
      normalized.absenceStartTime = formatTimeString(startTime);
    }
  }
  
  if (!normalized.absenceEndTime && normalized.absenceStartTime && normalized.absenceDuration) {
    const startTime = parseTimeString(normalized.absenceStartTime);
    if (startTime !== null) {
      const endTime = addHoursToTime(startTime, normalized.absenceDuration);
      normalized.absenceEndTime = formatTimeString(endTime);
    }
  }
  
  if (normalized.windowType === 'low_e_double') {
    normalized.windowType = 'low_e';
  }
  
  return normalized;
}

function parseTimeString(timeStr) {
  if (!timeStr) return null;
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes: minutes || 0 };
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    return { hours, minutes };
  }
  return null;
}

function addHoursToTime(time, hoursToAdd) {
  const totalMinutes = time.hours * 60 + time.minutes + (hoursToAdd * 60);
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return { hours: newHours, minutes: newMinutes };
}

function formatTimeString(time) {
  const period = time.hours >= 12 ? 'PM' : 'AM';
  const hours12 = time.hours % 12 || 12;
  const minutes = time.minutes.toString().padStart(2, '0');
  return `${hours12}:${minutes} ${period}`;
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
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
  skeletonContainer: {
    marginTop: 16,
  },
  progressCard: {
    padding: 0,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 6,
  },
  currentStepText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  tipCard: {
    marginTop: 16,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 0,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
