import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Step1Location from '../components/forms/Step1Location';
import Step2Building from '../components/forms/Step2Building';
import Step3Insulation from '../components/forms/Step3Insulation';
import Step4Schedule from '../components/forms/Step4Schedule';
import Step5Utility from '../components/forms/Step5Utility';
import Step6Review from '../components/forms/Step6Review';

export default function InputForm({ route }) {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(route?.params?.formData || {});
  
  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // On final step, go to loading page
      navigation.navigate('Loading', { formData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Location formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2Building formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Insulation formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4Schedule formData={formData} setFormData={setFormData} />;
      case 5:
        return <Step5Utility formData={formData} setFormData={setFormData} />;
      case 6:
        return <Step6Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Step {currentStep} of {totalSteps}
            </Text>
            <Text style={styles.progressText}>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentStep / totalSteps) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Form Content */}
        <View style={styles.formContent}>
          {renderStep()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={handleBack}
            disabled={currentStep === 1}
            style={[styles.navButton, styles.backButton, currentStep === 1 && styles.disabledButton]}
          >
            <Ionicons name="arrow-back" size={20} color={currentStep === 1 ? '#999' : '#333'} />
            <Text style={[styles.navButtonText, currentStep === 1 && styles.disabledText]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.navButton, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? 'Calculate' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 6,
  },
  formContent: {
    marginBottom: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  backButton: {
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#1976D2',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledText: {
    color: '#999',
  },
});

