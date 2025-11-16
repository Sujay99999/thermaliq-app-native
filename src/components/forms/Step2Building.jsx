import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function Step2Building({ formData, setFormData, errors = {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home" size={64} color="#1976D2" />
        <Text style={styles.title}>Building Basics</Text>
        <Text style={styles.subtitle}>
          Tell us about your home's size and construction
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* Home Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Home Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.homeType && styles.inputError]}>
            <Picker
              selectedValue={formData.homeType || ''}
              onValueChange={(value) => setFormData({ ...formData, homeType: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Single-Family Home" value="single-family" />
              <Picker.Item label="Apartment" value="apartment" />
              <Picker.Item label="Townhouse" value="townhouse" />
              <Picker.Item label="Condo" value="condo" />
            </Picker>
          </View>
          {errors.homeType && (
            <Text style={styles.errorText}>{errors.homeType}</Text>
          )}
        </View>

        {/* Floor Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Floor Area (sq ft) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="e.g., 2000"
            placeholderTextColor="#9CA3AF"
            value={formData.floorArea || ''}
            onChangeText={(text) => setFormData({ ...formData, floorArea: text })}
            style={[styles.input, errors.floorArea && styles.inputError]}
            keyboardType="numeric"
          />
          {errors.floorArea && (
            <Text style={styles.errorText}>{errors.floorArea}</Text>
          )}
        </View>

        {/* Ceiling Height */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Ceiling Height (ft) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="e.g., 8"
            placeholderTextColor="#9CA3AF"
            value={formData.ceilingHeight || ''}
            onChangeText={(text) => setFormData({ ...formData, ceilingHeight: text })}
            style={[styles.input, errors.ceilingHeight && styles.inputError]}
            keyboardType="numeric"
          />
          {errors.ceilingHeight && (
            <Text style={styles.errorText}>{errors.ceilingHeight}</Text>
          )}
        </View>

        {/* Construction Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Construction Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.constructionType && styles.inputError]}>
            <Picker
              selectedValue={formData.constructionType || ''}
              onValueChange={(value) => setFormData({ ...formData, constructionType: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Wood Frame" value="wood_frame" />
              <Picker.Item label="Brick" value="brick" />
              <Picker.Item label="Concrete" value="concrete" />
              <Picker.Item label="Mixed" value="mixed" />
            </Picker>
          </View>
          {errors.constructionType && (
            <Text style={styles.errorText}>{errors.constructionType}</Text>
          )}
        </View>

        {/* Construction Era */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            When was it built? <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.constructionEra && styles.inputError]}>
            <Picker
              selectedValue={formData.constructionEra || ''}
              onValueChange={(value) => setFormData({ ...formData, constructionEra: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Before 1980" value="before_1980" />
              <Picker.Item label="1980-2000" value="1980_2000" />
              <Picker.Item label="2000-2010" value="2000_2010" />
              <Picker.Item label="After 2010" value="after_2010" />
            </Picker>
          </View>
          {errors.constructionEra && (
            <Text style={styles.errorText}>{errors.constructionEra}</Text>
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
