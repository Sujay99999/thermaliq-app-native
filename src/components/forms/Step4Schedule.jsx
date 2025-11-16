import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function Step4Schedule({ formData, setFormData, errors = {} }) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState({ hours: 8, minutes: 0 });

  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hours12}:${minutesStr} ${period}`;
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: 8, minutes: 0 };
    
    // Try to parse "8:00 AM" format
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hours24 = hours;
      if (period === 'PM' && hours !== 12) hours24 += 12;
      if (period === 'AM' && hours === 12) hours24 = 0;
      return { hours: hours24, minutes: minutes || 0 };
    }
    
    // Try to parse "08:00" format
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      return { hours, minutes };
    }
    
    return { hours: 8, minutes: 0 };
  };

  const handleTimeSelect = () => {
    const timeString = formatTime(tempTime.hours, tempTime.minutes);
    setFormData({ ...formData, absenceStartTime: timeString });
    setShowTimePicker(false);
  };

  const openTimePicker = () => {
    const parsed = parseTime(formData.absenceStartTime);
    setTempTime(parsed);
    setShowTimePicker(true);
  };

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
            placeholder="e.g., 72"
            placeholderTextColor="#9CA3AF"
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
          <TouchableOpacity
            onPress={openTimePicker}
            style={[styles.timeInputContainer, errors.absenceStartTime && styles.inputError]}
          >
            <Text style={[styles.timeInputText, !formData.absenceStartTime && styles.timeInputPlaceholder]}>
              {formData.absenceStartTime || 'e.g., 8:00 AM'}
            </Text>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
          {errors.absenceStartTime && (
            <Text style={styles.errorText}>{errors.absenceStartTime}</Text>
          )}
        </View>

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Hour</Text>
                  <ScrollView 
                    style={styles.timePickerScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.timePickerScrollContent}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => setTempTime({ ...tempTime, hours: i })}
                        style={[
                          styles.timePickerOption,
                          tempTime.hours === i && styles.timePickerOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timePickerOptionText,
                            tempTime.hours === i && styles.timePickerOptionTextSelected,
                          ]}
                        >
                          {i.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <Text style={styles.timePickerSeparator}>:</Text>

                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Minute</Text>
                  <ScrollView 
                    style={styles.timePickerScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.timePickerScrollContent}
                  >
                    {[0, 15, 30, 45].map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        onPress={() => setTempTime({ ...tempTime, minutes: minute })}
                        style={[
                          styles.timePickerOption,
                          tempTime.minutes === minute && styles.timePickerOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timePickerOptionText,
                            tempTime.minutes === minute && styles.timePickerOptionTextSelected,
                          ]}
                        >
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={[styles.modalButton, styles.modalButtonCancel]}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleTimeSelect}
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                >
                  <Text style={styles.modalButtonConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  timeInputText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  timeInputPlaceholder: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    gap: 16,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  timePickerScroll: {
    maxHeight: 200,
    width: '100%',
  },
  timePickerScrollContent: {
    paddingVertical: 8,
  },
  timePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  timePickerOptionSelected: {
    backgroundColor: '#1976D2',
  },
  timePickerOptionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  timePickerOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timePickerSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonConfirm: {
    backgroundColor: '#1976D2',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

