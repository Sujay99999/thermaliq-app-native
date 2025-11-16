import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Step1Location({ formData, setFormData, errors = {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={64} color="#1976D2" />
        <Text style={styles.title}>Location & Climate</Text>
        <Text style={styles.subtitle}>
          Let's start with your location to get current weather data
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* ZIP Code Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            ZIP Code <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="e.g., 02134"
            maxLength={5}
            value={formData.zipCode || ''}
            onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
            style={[
              styles.input,
              errors.zipCode && styles.inputError,
            ]}
            keyboardType="numeric"
          />
          {errors.zipCode && (
            <Text style={styles.errorText}>{errors.zipCode}</Text>
          )}
        </View>

        {/* Outdoor Temperature */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Outdoor Temperature (°F) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="85"
            value={formData.outdoorTemp || ''}
            onChangeText={(text) => setFormData({ ...formData, outdoorTemp: text })}
            style={[
              styles.input,
              errors.outdoorTemp && styles.inputError,
            ]}
            keyboardType="numeric"
          />
          {errors.outdoorTemp && (
            <Text style={styles.errorText}>{errors.outdoorTemp}</Text>
          )}
          <Text style={styles.helperText}>
            We'll fetch this automatically based on your ZIP code
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

