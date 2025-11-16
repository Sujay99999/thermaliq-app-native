import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { calculateHVAC } from '../services/api';

export default function Loading() {
  const navigation = useNavigation();
  const route = useRoute();
  const formData = route.params?.formData || {};
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Analyzing building properties...');

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
    const performCalculation = async () => {
      // Simulate progress
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
        // Call backend API (will use mock data if backend not available)
        const roomData = route.params?.roomData || {};
        const result = await calculateHVAC(formData, roomData);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Navigate to results with actual data
        setTimeout(() => {
          navigation.navigate('Results', {
            formData,
            results: result.data,
          });
        }, 500);
      } catch (error) {
        console.error('Calculation error:', error);
        clearInterval(progressInterval);
        setProgress(100);
        // Navigate with mock data on error
        setTimeout(() => {
          navigation.navigate('Results', { formData });
        }, 500);
      }
    };

    performCalculation();
  }, [navigation, formData, route.params]);

  useEffect(() => {
    // Update step message based on progress
    const stepIndex = Math.floor((progress / 100) * steps.length);
    if (stepIndex < steps.length) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [progress]);

  useEffect(() => {
    // Rotate tips every 3 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 3000);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ActivityIndicator size="large" color="#1976D2" />
          </View>
          <Text style={styles.title}>THERMSOL.ai is analyzing...</Text>
          <Text style={styles.subtitle}>Calculating your optimal HVAC strategy</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={styles.currentStepText}>{currentStep}</Text>
        </View>

        {/* Energy Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Did you know?</Text>
          <Text style={styles.tipText}>{currentTip}</Text>
        </View>
      </View>
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
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#1976D2',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  progressBarBackground: {
    width: '100%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 8,
  },
  currentStepText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

