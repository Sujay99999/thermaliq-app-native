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
import Step7Incentives from '../components/forms/Step7Incentives';

export default function InputForm({ route }) {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(route?.params?.formData || {});
  const [errors, setErrors] = useState({});
  
  const totalSteps = 7;

  // Validation functions for each step
  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        // Step 1: Location & Climate
        if (!formData.zipCode || formData.zipCode.trim() === '') {
          stepErrors.zipCode = 'ZIP code is required';
        }
        if (!formData.outdoorTemp || formData.outdoorTemp.trim() === '') {
          stepErrors.outdoorTemp = 'Outdoor temperature is required';
        } else if (isNaN(Number(formData.outdoorTemp))) {
          stepErrors.outdoorTemp = 'Outdoor temperature must be a number';
        }
        break;
        
      case 2:
        // Step 2: Building Basics
        if (!formData.homeType || formData.homeType === '') {
          stepErrors.homeType = 'Home type is required';
        }
        if (!formData.floorArea || formData.floorArea.trim() === '') {
          stepErrors.floorArea = 'Floor area is required';
        } else if (isNaN(Number(formData.floorArea)) || Number(formData.floorArea) <= 0) {
          stepErrors.floorArea = 'Floor area must be a positive number';
        }
        if (!formData.constructionType || formData.constructionType === '') {
          stepErrors.constructionType = 'Construction type is required';
        }
        if (!formData.constructionEra || formData.constructionEra === '') {
          stepErrors.constructionEra = 'Construction era is required';
        }
        break;
        
      case 3:
        // Step 3: Insulation & Windows
        if (!formData.insulationQuality || formData.insulationQuality === '') {
          stepErrors.insulationQuality = 'Insulation quality is required';
        }
        if (!formData.windowType || formData.windowType === '') {
          stepErrors.windowType = 'Window type is required';
        }
        if (!formData.hvacType || formData.hvacType === '') {
          stepErrors.hvacType = 'HVAC system type is required';
        }
        if (!formData.hvacAge || formData.hvacAge === '') {
          stepErrors.hvacAge = 'HVAC system age is required';
        }
        break;
        
      case 4:
        // Step 4: Schedule & Comfort
        if (!formData.desiredTemp || formData.desiredTemp.trim() === '') {
          stepErrors.desiredTemp = 'Desired temperature is required';
        } else if (isNaN(Number(formData.desiredTemp))) {
          stepErrors.desiredTemp = 'Desired temperature must be a number';
        }
        if (!formData.absenceDuration || formData.absenceDuration === '') {
          stepErrors.absenceDuration = 'Absence duration is required';
        }
        if (!formData.absenceStartTime || formData.absenceStartTime.trim() === '') {
          stepErrors.absenceStartTime = 'Absence start time is required';
        }
        if (!formData.daysPerWeek || formData.daysPerWeek === '') {
          stepErrors.daysPerWeek = 'Days per week is required';
        }
        break;
        
      case 5:
        // Step 5: Utility Costs (all optional, no validation needed)
        break;
        
      case 6:
        // Step 6: Tax Incentives (all optional, no validation needed)
        break;
        
      case 7:
        // Step 7: Review - validate all critical fields
        const criticalFields = ['outdoorTemp', 'desiredTemp', 'absenceDuration', 'floorArea'];
        criticalFields.forEach(field => {
          const value = formData[field];
          if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
            stepErrors[field] = 'This field is required';
          }
        });
        break;
    }
    
    return stepErrors;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      // Show errors
      setErrors(stepErrors);
      // Scroll to top to show errors
      return;
    }
    
    // Clear errors for this step
    setErrors({});
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // On final step, go to loading page
      navigation.navigate('Loading', { formData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Clear errors when going back
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Location formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <Step2Building formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <Step3Insulation formData={formData} setFormData={setFormData} errors={errors} />;
      case 4:
        return <Step4Schedule formData={formData} setFormData={setFormData} errors={errors} />;
      case 5:
        return <Step5Utility formData={formData} setFormData={setFormData} errors={errors} />;
      case 6:
        return <Step7Incentives formData={formData} setFormData={setFormData} errors={errors} />;
      case 7:
        return <Step6Review formData={formData} errors={errors} />;
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

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <View style={styles.errorSummary}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorSummaryText}>
              Please fix the errors below before proceeding
            </Text>
          </View>
        )}

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
  errorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorSummaryText: {
    flex: 1,
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
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

