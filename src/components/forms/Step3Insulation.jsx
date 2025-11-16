import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function Step3Insulation({ formData, setFormData, errors = {} }) {
  const insulationOptions = ['Poor', 'Average', 'Good', 'Excellent'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="snow" size={64} color="#1976D2" />
        <Text style={styles.title}>Insulation & Windows</Text>
        <Text style={styles.subtitle}>
          These affect how quickly your building heats up or cools down
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* Insulation Quality */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Insulation Quality <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.buttonGrid}>
            {insulationOptions.map((quality) => (
              <TouchableOpacity
                key={quality}
                onPress={() => setFormData({ ...formData, insulationQuality: quality.toLowerCase() })}
                style={[
                  styles.qualityButton,
                  formData.insulationQuality === quality.toLowerCase()
                    ? styles.qualityButtonActive
                    : errors.insulationQuality
                    ? styles.qualityButtonError
                    : styles.qualityButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.qualityButtonText,
                    formData.insulationQuality === quality.toLowerCase() && styles.qualityButtonTextActive,
                  ]}
                >
                  {quality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.insulationQuality && (
            <Text style={styles.errorText}>{errors.insulationQuality}</Text>
          )}
        </View>

        {/* Window Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Window Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.windowType && styles.inputError]}>
            <Picker
              selectedValue={formData.windowType || ''}
              onValueChange={(value) => setFormData({ ...formData, windowType: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Single-Pane" value="single_pane" />
              <Picker.Item label="Double-Pane" value="double_pane" />
              <Picker.Item label="Triple-Pane" value="triple_pane" />
              <Picker.Item label="Low-E Double-Pane" value="low_e_double" />
            </Picker>
          </View>
          {errors.windowType && (
            <Text style={styles.errorText}>{errors.windowType}</Text>
          )}
        </View>

        {/* HVAC Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            HVAC System Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.hvacType && styles.inputError]}>
            <Picker
              selectedValue={formData.hvacType || ''}
              onValueChange={(value) => setFormData({ ...formData, hvacType: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Central Air Conditioning" value="central_ac" />
              <Picker.Item label="Heat Pump" value="heat_pump" />
              <Picker.Item label="Window Unit" value="window_unit" />
              <Picker.Item label="Ductless Mini-Split" value="ductless" />
            </Picker>
          </View>
          {errors.hvacType && (
            <Text style={styles.errorText}>{errors.hvacType}</Text>
          )}
        </View>

        {/* HVAC Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            HVAC System Age <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.hvacAge && styles.inputError]}>
            <Picker
              selectedValue={formData.hvacAge || ''}
              onValueChange={(value) => setFormData({ ...formData, hvacAge: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Less than 5 years" value="under_5" />
              <Picker.Item label="5-10 years" value="5_10" />
              <Picker.Item label="10-15 years" value="10_15" />
              <Picker.Item label="15+ years" value="15_plus" />
            </Picker>
          </View>
          {errors.hvacAge && (
            <Text style={styles.errorText}>{errors.hvacAge}</Text>
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
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  qualityButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#1976D2',
  },
  qualityButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  qualityButtonError: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  qualityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  qualityButtonTextActive: {
    color: '#fff',
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

