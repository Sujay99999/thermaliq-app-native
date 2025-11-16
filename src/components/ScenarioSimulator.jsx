import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function ScenarioSimulator({ initialFormData, onScenarioChange }) {
  const [scenarioData, setScenarioData] = useState({
    outdoorTemp: parseInt(initialFormData?.outdoorTemp) || 85,
    desiredTemp: parseInt(initialFormData?.desiredTemp) || 72,
    absenceDuration: parseInt(initialFormData?.absenceDuration) || 8,
    floorArea: parseInt(initialFormData?.floorArea) || 2000,
    insulationQuality: initialFormData?.insulationQuality || 'average',
  });

  const handleSliderChange = (field, value) => {
    const newData = { ...scenarioData, [field]: value };
    setScenarioData(newData);
    
    if (onScenarioChange) {
      onScenarioChange(newData);
    }
  };

  const resetToOriginal = () => {
    const original = {
      outdoorTemp: parseInt(initialFormData?.outdoorTemp) || 85,
      desiredTemp: parseInt(initialFormData?.desiredTemp) || 72,
      absenceDuration: parseInt(initialFormData?.absenceDuration) || 8,
      floorArea: parseInt(initialFormData?.floorArea) || 2000,
      insulationQuality: initialFormData?.insulationQuality || 'average',
    };
    setScenarioData(original);
    if (onScenarioChange) {
      onScenarioChange(original);
    }
  };

  const insulationLevels = ['poor', 'average', 'good', 'excellent'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Try Different Scenarios</Text>
          <Text style={styles.subtitle}>
            Adjust parameters to see how they affect your savings
          </Text>
        </View>
        <TouchableOpacity
          onPress={resetToOriginal}
          style={styles.resetButton}
        >
          <Ionicons name="refresh" size={16} color="#374151" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Outdoor Temperature Slider */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Outdoor Temperature</Text>
            <Text style={styles.sliderValue}>{scenarioData.outdoorTemp}°F</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={60}
            maximumValue={110}
            step={1}
            value={scenarioData.outdoorTemp}
            onValueChange={(value) => handleSliderChange('outdoorTemp', Math.round(value))}
            minimumTrackTintColor="#1976D2"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#1976D2"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>60°F</Text>
            <Text style={styles.rangeText}>110°F</Text>
          </View>
        </View>

        {/* Desired Temperature Slider */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Desired Indoor Temperature</Text>
            <Text style={styles.sliderValue}>{scenarioData.desiredTemp}°F</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={65}
            maximumValue={78}
            step={1}
            value={scenarioData.desiredTemp}
            onValueChange={(value) => handleSliderChange('desiredTemp', Math.round(value))}
            minimumTrackTintColor="#1976D2"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#1976D2"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>65°F</Text>
            <Text style={styles.rangeText}>78°F</Text>
          </View>
        </View>

        {/* Absence Duration Slider */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Absence Duration</Text>
            <Text style={styles.sliderValue}>{scenarioData.absenceDuration} hours</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={48}
            step={1}
            value={scenarioData.absenceDuration}
            onValueChange={(value) => handleSliderChange('absenceDuration', Math.round(value))}
            minimumTrackTintColor="#1976D2"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#1976D2"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>1 hour</Text>
            <Text style={styles.rangeText}>48 hours</Text>
          </View>
        </View>

        {/* Floor Area Slider */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Floor Area</Text>
            <Text style={styles.sliderValue}>{scenarioData.floorArea.toLocaleString()} sq ft</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={500}
            maximumValue={5000}
            step={100}
            value={scenarioData.floorArea}
            onValueChange={(value) => handleSliderChange('floorArea', Math.round(value))}
            minimumTrackTintColor="#1976D2"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#1976D2"
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>500 sq ft</Text>
            <Text style={styles.rangeText}>5,000 sq ft</Text>
          </View>
        </View>

        {/* Insulation Quality Selector */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Insulation Quality</Text>
            <Text style={[styles.sliderValue, { textTransform: 'capitalize' }]}>
              {scenarioData.insulationQuality}
            </Text>
          </View>
          <View style={styles.buttonGrid}>
            {insulationLevels.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => handleSliderChange('insulationQuality', level)}
                style={[
                  styles.qualityButton,
                  scenarioData.insulationQuality === level
                    ? styles.qualityButtonActive
                    : styles.qualityButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.qualityButtonText,
                    scenarioData.insulationQuality === level && styles.qualityButtonTextActive,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Quick Presets */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Quick Scenarios:</Text>
        <View style={styles.presetsGrid}>
          <TouchableOpacity
            onPress={() => {
              const workDay = {
                outdoorTemp: 85,
                desiredTemp: 72,
                absenceDuration: 8,
                floorArea: scenarioData.floorArea,
                insulationQuality: scenarioData.insulationQuality,
              };
              setScenarioData(workDay);
              if (onScenarioChange) onScenarioChange(workDay);
            }}
            style={[styles.presetButton, styles.workDayButton]}
          >
            <Text style={styles.presetButtonText}>📅 Work Day (8 hrs)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const weekend = {
                outdoorTemp: 85,
                desiredTemp: 72,
                absenceDuration: 48,
                floorArea: scenarioData.floorArea,
                insulationQuality: scenarioData.insulationQuality,
              };
              setScenarioData(weekend);
              if (onScenarioChange) onScenarioChange(weekend);
            }}
            style={[styles.presetButton, styles.weekendButton]}
          >
            <Text style={styles.presetButtonText}>🏖️ Weekend Trip (48 hrs)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const errand = {
                outdoorTemp: 85,
                desiredTemp: 72,
                absenceDuration: 2,
                floorArea: scenarioData.floorArea,
                insulationQuality: scenarioData.insulationQuality,
              };
              setScenarioData(errand);
              if (onScenarioChange) onScenarioChange(errand);
            }}
            style={[styles.presetButton, styles.errandButton]}
          >
            <Text style={styles.presetButtonText}>🚗 Quick Errand (2 hrs)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    gap: 24,
  },
  sliderGroup: {
    marginBottom: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    fontSize: 10,
    color: '#999',
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#1976D2',
  },
  qualityButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  qualityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  qualityButtonTextActive: {
    color: '#fff',
  },
  presetsContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  presetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  workDayButton: {
    backgroundColor: '#DBEAFE',
  },
  weekendButton: {
    backgroundColor: '#D1FAE5',
  },
  errandButton: {
    backgroundColor: '#FEF3C7',
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
  },
});

