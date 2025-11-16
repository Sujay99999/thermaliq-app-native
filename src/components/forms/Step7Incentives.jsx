import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

export default function Step7Incentives({ formData, setFormData, errors = {} }) {
  const handleEquipmentChange = (equipment) => {
    const current = formData.equipmentSelected || [];
    const updated = current.includes(equipment)
      ? current.filter(item => item !== equipment)
      : [...current, equipment];
    setFormData({ ...formData, equipmentSelected: updated });
  };

  const equipmentOptions = [
    { id: 'heat_pump', label: 'Heat Pump' },
    { id: 'heat_pump_water_heater', label: 'Heat Pump Water Heater' },
    { id: 'central_ac', label: 'Central AC' },
    { id: 'furnace', label: 'Furnace' },
    { id: 'weatherization', label: 'Weatherization / Insulation' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cash" size={64} color="#10b981" />
        <Text style={styles.title}>Tax Incentives & Rebates</Text>
        <Text style={styles.subtitle}>
          Check if you qualify for federal and state incentives (Optional)
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* Homeowner Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Do you own the home where the HVAC upgrade will be installed?
          </Text>
          <View style={styles.buttonGrid}>
            {['Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFormData({ ...formData, ownsHome: option.toLowerCase() })}
                style={[
                  styles.optionButton,
                  formData.ownsHome === option.toLowerCase()
                    ? styles.optionButtonActive
                    : styles.optionButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    formData.ownsHome === option.toLowerCase() && styles.optionButtonTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Primary Residence */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Is this your primary residence?
          </Text>
          <View style={styles.buttonGrid}>
            {['Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFormData({ ...formData, primaryResidence: option.toLowerCase() })}
                style={[
                  styles.optionButton,
                  formData.primaryResidence === option.toLowerCase()
                    ? styles.optionButtonActive
                    : styles.optionButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    formData.primaryResidence === option.toLowerCase() && styles.optionButtonTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            What type of property is it?
          </Text>
          <View style={[styles.pickerContainer, errors.propertyType && styles.inputError]}>
            <Picker
              selectedValue={formData.propertyType || ''}
              onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Single-family home" value="single_family" />
              <Picker.Item label="Multi-family (≤3 stories)" value="multi_family" />
              <Picker.Item label="Rental property (as landlord)" value="rental" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Equipment Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Are you planning to install or recently installed (this year) any of the following?
          </Text>
          <View style={styles.checkboxList}>
            {equipmentOptions.map((equipment) => (
              <TouchableOpacity
                key={equipment.id}
                onPress={() => handleEquipmentChange(equipment.id)}
                style={styles.checkboxItem}
              >
                <View style={[
                  styles.checkbox,
                  (formData.equipmentSelected || []).includes(equipment.id) && styles.checkboxChecked
                ]}>
                  {(formData.equipmentSelected || []).includes(equipment.id) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{equipment.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Efficiency Criteria */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Will/Did the equipment meet ENERGY STAR or the program's efficiency criteria?
          </Text>
          <View style={[styles.pickerContainer, errors.equipmentMeetsEfficiency && styles.inputError]}>
            <Picker
              selectedValue={formData.equipmentMeetsEfficiency || ''}
              onValueChange={(value) => setFormData({ ...formData, equipmentMeetsEfficiency: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
              <Picker.Item label="Not sure" value="not_sure" />
            </Picker>
          </View>
        </View>

        {/* Project Cost */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Estimated or actual installation cost?
          </Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.iconText}>$</Text>
            <TextInput
              placeholder="e.g., 5000"
              placeholderTextColor="#9CA3AF"
              value={formData.projectCost || ''}
              onChangeText={(text) => setFormData({ ...formData, projectCost: text })}
              style={styles.inputWithIconInput}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={styles.infoBold}>This information helps us check your eligibility</Text> for federal tax credits (up to $3,200/year) and state rebates. All fields are optional but recommended.
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
    textAlign: 'center',
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
  buttonGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#1976D2',
  },
  optionButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  optionButtonTextActive: {
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
  checkboxList: {
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingLeft: 16,
  },
  iconText: {
    fontSize: 18,
    color: '#6B7280',
    marginRight: 8,
  },
  inputWithIconInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: 'bold',
  },
});

