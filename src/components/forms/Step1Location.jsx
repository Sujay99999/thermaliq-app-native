import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchWeatherByZip } from '../../services/api';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import AnimatedCard from '../AnimatedCard';

const AnimatedView = require('react-native-reanimated').default.View;
const AnimatedText = require('react-native-reanimated').default.Text;

export default function Step1Location({ formData, setFormData, errors = {} }) {
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const debounceTimerRef = useRef(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    cardOpacity.value = withTiming(1, { duration: 600 });
    cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  // Fetch weather when ZIP code is complete (5 digits)
  useEffect(() => {
    const zipCode = formData.zipCode || '';
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setWeatherError(null);

    if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
      debounceTimerRef.current = setTimeout(async () => {
        setIsLoadingWeather(true);
        setWeatherError(null);

        try {
          const result = await fetchWeatherByZip(zipCode);
          
          if (result.success) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              outdoorTemp: result.data.temperature.toString(),
            }));
            setWeatherError(null);
          } else {
            setWeatherError(result.error || 'Failed to fetch weather');
          }
        } catch (error) {
          setWeatherError('Failed to fetch weather data');
        } finally {
          setIsLoadingWeather(false);
        }
      }, 500);
    } else if (zipCode.length < 5) {
      setWeatherError(null);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.zipCode, setFormData]);

  return (
    <View style={styles.container}>
      <AnimatedView style={headerStyle}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Ionicons name="location" size={48} color="#1976D2" />
          </View>
          <Text style={styles.title}>Location & Climate</Text>
          <Text style={styles.subtitle}>
            Let's start with your location to get current weather data
          </Text>
        </View>
      </AnimatedView>

      <AnimatedView style={cardStyle}>
        <AnimatedCard variant="elevated" style={styles.formCard}>
          {/* ZIP Code Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              ZIP Code <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, errors.zipCode && styles.inputError]}>
                <Ionicons 
                  name="location-outline" 
                  size={20} 
                  color="#6B7280" 
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="e.g., 02134"
                  placeholderTextColor="#9CA3AF"
                  maxLength={5}
                  value={formData.zipCode || ''}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, zipCode: numericText });
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                />
                {isLoadingWeather && (
                  <View style={styles.loadingIndicator}>
                    <ActivityIndicator size="small" color="#1976D2" />
                  </View>
                )}
              </View>
            </View>
            {errors.zipCode && (
              <Text style={styles.errorText}>{errors.zipCode}</Text>
            )}
            {weatherError && !isLoadingWeather && (
              <Text style={styles.warningText}>
                ⚠️ {weatherError}. Please enter temperature manually.
              </Text>
            )}
          </View>

          {/* Outdoor Temperature */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Outdoor Temperature (°F) <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.outdoorTemp && styles.inputError]}>
              <Ionicons 
                name="thermometer-outline" 
                size={20} 
                color="#6B7280" 
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="e.g., 85"
                placeholderTextColor="#9CA3AF"
                value={formData.outdoorTemp || ''}
                onChangeText={(text) => setFormData({ ...formData, outdoorTemp: text })}
                style={styles.input}
                keyboardType="numeric"
                editable={!isLoadingWeather}
              />
            </View>
            {errors.outdoorTemp && (
              <Text style={styles.errorText}>{errors.outdoorTemp}</Text>
            )}
            <Text style={styles.helperText}>
              {isLoadingWeather 
                ? 'Fetching current temperature...' 
                : 'We\'ll fetch this automatically based on your ZIP code'}
            </Text>
          </View>
        </AnimatedCard>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    minHeight: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 6,
  },
  warningText: {
    fontSize: 14,
    color: '#F59E0B',
    marginTop: 6,
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
