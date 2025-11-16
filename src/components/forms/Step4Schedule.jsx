import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function Step4Schedule({ formData, setFormData, errors = {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time" size={64} color="#1976D2" />
        <Text style={styles.title}>Schedule & Comfort</Text>
        <Text style={styles.subtitle}>
          When are you away and what temperature do you prefer?
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* Desired Temperature */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Desired Indoor Temperature (°F) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="72"
            value={formData.desiredTemp || ''}
            onChangeText={(text) => setFormData({ ...formData, desiredTemp: text })}
            style={[styles.input, errors.desiredTemp && styles.inputError]}
            keyboardType="numeric"
          />
          {errors.desiredTemp && (
            <Text style={styles.errorText}>{errors.desiredTemp}</Text>
          )}
        </View>

        {/* Absence Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            How long are you typically away? <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.absenceDuration && styles.inputError]}>
            <Picker
              selectedValue={formData.absenceDuration || ''}
              onValueChange={(value) => setFormData({ ...formData, absenceDuration: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="2 hours" value="2" />
              <Picker.Item label="4 hours" value="4" />
              <Picker.Item label="8 hours (work day)" value="8" />
              <Picker.Item label="12 hours" value="12" />
              <Picker.Item label="24 hours" value="24" />
              <Picker.Item label="48 hours (weekend)" value="48" />
            </Picker>
          </View>
          {errors.absenceDuration && (
            <Text style={styles.errorText}>{errors.absenceDuration}</Text>
          )}
        </View>

        {/* Absence Start Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            What time do you usually leave? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="08:00"
            value={formData.absenceStartTime || ''}
            onChangeText={(text) => setFormData({ ...formData, absenceStartTime: text })}
            style={[styles.input, errors.absenceStartTime && styles.inputError]}
            keyboardType="default"
          />
          {errors.absenceStartTime && (
            <Text style={styles.errorText}>{errors.absenceStartTime}</Text>
          )}
        </View>

        {/* Days Per Week */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            How many days per week are you away like this? <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.daysPerWeek && styles.inputError]}>
            <Picker
              selectedValue={formData.daysPerWeek || ''}
              onValueChange={(value) => setFormData({ ...formData, daysPerWeek: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="1 day per week" value="1" />
              <Picker.Item label="2 days per week" value="2" />
              <Picker.Item label="3 days per week" value="3" />
              <Picker.Item label="4 days per week" value="4" />
              <Picker.Item label="5 days per week (weekdays)" value="5" />
              <Picker.Item label="6 days per week" value="6" />
              <Picker.Item label="7 days per week (every day)" value="7" />
            </Picker>
          </View>
          {errors.daysPerWeek && (
            <Text style={styles.errorText}>{errors.daysPerWeek}</Text>
          )}
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
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
});

