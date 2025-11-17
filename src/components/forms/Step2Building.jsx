import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { extractMatterportMeasurements } from '../../services/api';

export default function Step2Building({ formData, setFormData, errors = {} }) {
  const [showMatterportModal, setShowMatterportModal] = useState(false);
  const [modelSid, setModelSid] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedMeasurements, setExtractedMeasurements] = useState(null);

  const handleMatterportScan = async () => {
    console.log('[Step2Building] handleMatterportScan called');
    console.log('[Step2Building] Platform:', Platform.OS);
    
    // Web: Show modal directly for Model SID input
    if (Platform.OS === 'web') {
      console.log('[Step2Building] Web platform, showing modal directly');
      setShowMatterportModal(true);
      return;
    }
    
    // Mobile: Try to open Matterport Capture app, fallback to modal
    console.log('[Step2Building] Mobile platform, attempting to open Matterport app');
    try {
      const { Linking } = require('react-native');
      const matterportUrl = 'matterport://capture';
      
      console.log('[Step2Building] Checking if Matterport app can be opened...');
      const canOpen = await Linking.canOpenURL(matterportUrl);
      console.log('[Step2Building] Can open Matterport app:', canOpen);
      
      if (canOpen) {
        console.log('[Step2Building] Opening Matterport app...');
        await Linking.openURL(matterportUrl);
        // After scan, user can enter Model SID
        setTimeout(() => {
          console.log('[Step2Building] Showing modal after Matterport app');
          setShowMatterportModal(true);
        }, 1000);
      } else {
        // App not installed, show modal to enter Model SID
        console.log('[Step2Building] Matterport app not available, showing modal directly');
        setShowMatterportModal(true);
      }
    } catch (error) {
      console.error('[Step2Building] Error in handleMatterportScan:', error);
      // Fallback to modal
      setShowMatterportModal(true);
    }
  };

  const handleExtractMeasurements = async () => {
    console.log('[Step2Building] handleExtractMeasurements called');
    console.log('[Step2Building] Model SID:', modelSid);
    console.log('[Step2Building] Platform:', Platform.OS);
    
    if (!modelSid || modelSid.trim() === '') {
      console.log('[Step2Building] Model SID is empty, showing alert');
      Alert.alert('Error', 'Please enter a Matterport Model SID');
      return;
    }

    console.log('[Step2Building] Starting extraction with Model SID:', modelSid.trim());
    setLoading(true);
    setExtractedMeasurements(null);
    
    try {
      console.log('[Step2Building] Calling extractMatterportMeasurements...');
      const response = await extractMatterportMeasurements(modelSid.trim());
      console.log('[Step2Building] Response received:', response);
      
      if (response.success && response.data) {
        const measurements = response.data;
        console.log('[Step2Building] Measurements extracted:', measurements);
        
        // Store extracted measurements to display in UI
        setExtractedMeasurements({
          floorArea: measurements.floorArea ? Math.round(measurements.floorArea) : null,
          ceilingHeight: measurements.ceilingHeight ? Math.round(measurements.ceilingHeight * 10) / 10 : null,
          windowArea: measurements.windowArea ? Math.round(measurements.windowArea) : null,
          windowAreaPercent: measurements.windowAreaPercent ? Math.round(measurements.windowAreaPercent * 10) / 10 : null,
          doorCount: measurements.doorCount !== undefined && measurements.doorCount !== null ? measurements.doorCount : null,
          wallArea: measurements.wallArea ? Math.round(measurements.wallArea) : null,
          netWallArea: measurements.netWallArea ? Math.round(measurements.netWallArea) : null,
          roofArea: measurements.roofArea ? Math.round(measurements.roofArea) : null,
          totalDoorArea: measurements.totalDoorArea ? Math.round(measurements.totalDoorArea) : null,
          roomVolume: measurements.roomVolume ? Math.round(measurements.roomVolume) : null,
          roomDimensions: measurements.roomDimensions || null,
        });
        console.log('[Step2Building] Measurements stored in state');
      } else {
        console.error('[Step2Building] Response missing success or data:', response);
        throw new Error('Failed to extract measurements');
      }
    } catch (error) {
      console.error('[Step2Building] Error extracting Matterport measurements:', error);
      console.error('[Step2Building] Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        userMessage: error.userMessage,
      });
      Alert.alert(
        'Error',
        error.userMessage || error.message || 'Failed to extract measurements from Matterport. Please check your Model SID and try again.',
        [{ text: 'OK' }]
      );
      setExtractedMeasurements(null);
    } finally {
      console.log('[Step2Building] Extraction complete, setting loading to false');
      setLoading(false);
    }
  };

  const handleApplyMeasurements = () => {
    if (!extractedMeasurements) return;

    // Auto-fill form fields with extracted measurements
    const updatedFormData = { ...formData };
    
    if (extractedMeasurements.floorArea) {
      updatedFormData.floorArea = extractedMeasurements.floorArea.toString();
    }
    
    if (extractedMeasurements.ceilingHeight) {
      updatedFormData.ceilingHeight = extractedMeasurements.ceilingHeight.toString();
    }
    
    if (extractedMeasurements.windowAreaPercent) {
      updatedFormData.windowAreaPercent = extractedMeasurements.windowAreaPercent.toString();
    }
    
    if (extractedMeasurements.doorCount !== null) {
      updatedFormData.numExteriorDoors = extractedMeasurements.doorCount.toString();
    }
    
    if (extractedMeasurements.wallArea) {
      updatedFormData.wallArea = extractedMeasurements.wallArea.toString();
    }
    
    if (extractedMeasurements.roofArea) {
      updatedFormData.roofArea = extractedMeasurements.roofArea.toString();
    }
    
    if (extractedMeasurements.totalDoorArea) {
      updatedFormData.totalDoorArea = extractedMeasurements.totalDoorArea.toString();
    }
    
    if (extractedMeasurements.roomDimensions) {
      if (extractedMeasurements.roomDimensions.width) {
        updatedFormData.roomWidth = Math.round(extractedMeasurements.roomDimensions.width).toString();
      }
      if (extractedMeasurements.roomDimensions.length) {
        updatedFormData.roomLength = Math.round(extractedMeasurements.roomDimensions.length).toString();
      } else if (extractedMeasurements.roomDimensions.depth) {
        updatedFormData.roomLength = Math.round(extractedMeasurements.roomDimensions.depth).toString();
      }
    }
    
    // Room volume is calculated/display only, not stored in form
    // But we can store it for reference
    if (extractedMeasurements.roomVolume) {
      updatedFormData.roomVolume = extractedMeasurements.roomVolume.toString();
    }
    
    setFormData(updatedFormData);
    setShowMatterportModal(false);
    setModelSid('');
    setExtractedMeasurements(null);
    
    Alert.alert(
      'Success',
      'Room measurements have been automatically filled from your Matterport scan!',
      [{ text: 'OK' }]
    );
  };

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

        {/* Matterport Integration */}
        <View style={styles.matterportSection}>
          <TouchableOpacity
            style={styles.matterportButton}
            onPress={() => {
              console.log('[Step2Building] Matterport button pressed!');
              handleMatterportScan();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cube-outline" size={20} color="#1976D2" />
            <Text style={styles.matterportButtonText}>
              Use Matterport Scan
            </Text>
          </TouchableOpacity>
          <Text style={styles.matterportHint}>
            Automatically fill room dimensions from your Matterport 3D scan
          </Text>
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

        {/* Room Dimensions */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Dimensions (Optional)</Text>
          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.subLabel}>Width (ft)</Text>
              <TextInput
                placeholder="e.g., 50"
                placeholderTextColor="#9CA3AF"
                value={formData.roomWidth || ''}
                onChangeText={(text) => setFormData({ ...formData, roomWidth: text })}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.subLabel}>Length (ft)</Text>
              <TextInput
                placeholder="e.g., 40"
                placeholderTextColor="#9CA3AF"
                value={formData.roomLength || ''}
                onChangeText={(text) => setFormData({ ...formData, roomLength: text })}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Room Volume (Display Only) */}
        {(() => {
          // Calculate volume if we have the data
          let calculatedVolume = null;
          if (formData.roomVolume) {
            calculatedVolume = parseInt(formData.roomVolume);
          } else if (formData.floorArea && formData.ceilingHeight) {
            const floorArea = parseFloat(formData.floorArea) || 0;
            const ceilingHeight = parseFloat(formData.ceilingHeight) || 0;
            if (floorArea > 0 && ceilingHeight > 0) {
              calculatedVolume = Math.round(floorArea * ceilingHeight);
            }
          } else if (formData.roomWidth && formData.roomLength && formData.ceilingHeight) {
            const width = parseFloat(formData.roomWidth) || 0;
            const length = parseFloat(formData.roomLength) || 0;
            const height = parseFloat(formData.ceilingHeight) || 0;
            if (width > 0 && length > 0 && height > 0) {
              calculatedVolume = Math.round(width * length * height);
            }
          }
          
          return calculatedVolume ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Volume (Calculated)</Text>
              <View style={styles.displayOnlyInput}>
                <Text style={styles.displayValue}>
                  {calculatedVolume.toLocaleString()} cu ft
                </Text>
                <Ionicons name="calculator-outline" size={20} color="#6B7280" />
              </View>
              <Text style={styles.helperText}>
                {formData.roomWidth && formData.roomLength 
                  ? 'Calculated from width × length × height'
                  : 'Calculated from floor area × ceiling height'}
              </Text>
            </View>
          ) : null;
        })()}

        {/* Wall Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wall Area (sq ft) (Optional)</Text>
          <TextInput
            placeholder="e.g., 950"
            placeholderTextColor="#9CA3AF"
            value={formData.wallArea || ''}
            onChangeText={(text) => setFormData({ ...formData, wallArea: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Total wall area for heat loss calculations
          </Text>
        </View>

        {/* Roof/Ceiling Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Roof/Ceiling Area (sq ft) (Optional)</Text>
          <TextInput
            placeholder="e.g., 2000"
            placeholderTextColor="#9CA3AF"
            value={formData.roofArea || ''}
            onChangeText={(text) => setFormData({ ...formData, roofArea: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Roof or ceiling area for insulation calculations
          </Text>
        </View>

        {/* Total Door Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Door Area (sq ft) (Optional)</Text>
          <TextInput
            placeholder="e.g., 42"
            placeholderTextColor="#9CA3AF"
            value={formData.totalDoorArea || ''}
            onChangeText={(text) => setFormData({ ...formData, totalDoorArea: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Total area of all doors (more accurate than count × 21 sq ft)
          </Text>
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

      {/* Matterport Modal */}
      <Modal
        visible={showMatterportModal}
        transparent={true}
        animationType={Platform.OS === 'web' ? 'fade' : 'slide'} // Slide animation for mobile
        onRequestClose={() => {
          console.log('[Step2Building] Modal onRequestClose called');
          setShowMatterportModal(false);
        }}
        onShow={() => {
          console.log('[Step2Building] Modal shown');
        }}
        presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined} // Better iOS presentation
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Matterport Scan</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowMatterportModal(false);
                  setModelSid('');
                  setExtractedMeasurements(null);
                }}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <ScrollView 
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.modalDescription}>
                  {Platform.OS === 'web' 
                    ? 'Enter your Matterport Model SID (Space ID) from an existing scan.'
                    : 'Enter your Matterport Model SID (Space ID) from your scan, or create a new scan using the Matterport Capture app.'}
                </Text>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>Model SID (Space ID)</Text>
                  <TextInput
                    placeholder="e.g., abc123xyz456"
                    placeholderTextColor="#9CA3AF"
                    value={modelSid}
                    onChangeText={setModelSid}
                    style={styles.modalInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

              {Platform.OS !== 'web' && (
                <TouchableOpacity
                  style={styles.matterportAppButton}
                  onPress={async () => {
                    try {
                      const { Linking } = require('react-native');
                      const url = 'https://matterport.com/capture';
                      const canOpen = await Linking.canOpenURL(url);
                      if (canOpen) {
                        await Linking.openURL(url);
                      }
                    } catch (error) {
                      Alert.alert('Error', 'Could not open Matterport website');
                    }
                  }}
                >
                  <Ionicons name="cube" size={20} color="#fff" />
                  <Text style={styles.matterportAppButtonText}>
                    Open Matterport Capture App
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalButton, loading && styles.modalButtonDisabled]}
                onPress={() => {
                  console.log('[Step2Building] Extract Measurements button pressed!');
                  console.log('[Step2Building] Current modelSid:', modelSid);
                  console.log('[Step2Building] Loading state:', loading);
                  handleExtractMeasurements();
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Extract Measurements</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Display Extracted Measurements */}
              {extractedMeasurements && (
                <View style={styles.measurementsContainer}>
                  <View style={styles.measurementsHeader}>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    <Text style={styles.measurementsTitle}>Extracted Measurements</Text>
                  </View>
                  
                  <View style={styles.measurementsGrid}>
                    {extractedMeasurements.floorArea !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="square-outline" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Floor Area</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.floorArea} sq ft
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.ceilingHeight !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="resize-outline" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Ceiling Height</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.ceilingHeight} ft
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.windowAreaPercent !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="grid-outline" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Window Area</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.windowAreaPercent}%
                        </Text>
                        {extractedMeasurements.windowArea !== null && (
                          <Text style={styles.measurementSubValue}>
                            ({extractedMeasurements.windowArea} sq ft)
                          </Text>
                        )}
                      </View>
                    )}
                    
                    {extractedMeasurements.doorCount !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="arrow-forward-outline" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Number of Doors</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.doorCount}
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.wallArea !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="square" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Wall Area</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.wallArea} sq ft
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.roofArea !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="home-outline" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Roof Area</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.roofArea} sq ft
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.totalDoorArea !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="arrow-forward" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Door Area</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.totalDoorArea} sq ft
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.roomVolume !== null && (
                      <View style={styles.measurementCard}>
                        <Ionicons name="cube-outline" size={22} color="#1976D2" />
                        <Text style={styles.measurementLabel}>Room Volume</Text>
                        <Text style={styles.measurementValue}>
                          {extractedMeasurements.roomVolume.toLocaleString()} cu ft
                        </Text>
                      </View>
                    )}
                    
                    {extractedMeasurements.roomDimensions && (
                      <>
                        {extractedMeasurements.roomDimensions.width && (
                          <View style={styles.measurementCard}>
                            <Ionicons name="resize" size={22} color="#1976D2" />
                            <Text style={styles.measurementLabel}>Room Width</Text>
                            <Text style={styles.measurementValue}>
                              {Math.round(extractedMeasurements.roomDimensions.width)} ft
                            </Text>
                          </View>
                        )}
                        {(extractedMeasurements.roomDimensions.length || extractedMeasurements.roomDimensions.depth) && (
                          <View style={styles.measurementCard}>
                            <Ionicons name="resize" size={22} color="#1976D2" />
                            <Text style={styles.measurementLabel}>Room Length</Text>
                            <Text style={styles.measurementValue}>
                              {Math.round(extractedMeasurements.roomDimensions.length || extractedMeasurements.roomDimensions.depth)} ft
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApplyMeasurements}
                  >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.applyButtonText}>Apply to Form</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.modalNote}>
                Note: You need a Matterport account and an active scan to use this feature.
              </Text>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
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
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  displayOnlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  displayValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    fontStyle: 'italic',
  },
  matterportSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  matterportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  matterportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  matterportHint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Changed from 'center' to 'flex-end' for mobile
    alignItems: 'center',
    padding: 0, // Changed from 20 to 0 for full-width on mobile
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, // Rounded top corners for mobile
    borderTopRightRadius: 20,
    borderBottomLeftRadius: Platform.OS === 'web' ? 16 : 0, // Only round bottom on web
    borderBottomRightRadius: Platform.OS === 'web' ? 16 : 0,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 400 : '100%', // Full width on mobile
    height: Platform.OS === 'web' ? undefined : '85%', // Set explicit height on mobile
    maxHeight: Platform.OS === 'web' ? '80%' : '90%', // Use percentage that works on mobile
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 }, // Shadow above for mobile
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column', // Column layout (flex is default in RN)
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 0,
    flex: 1, // Take available space
    maxHeight: Platform.OS === 'web' ? '70vh' : undefined, // Remove vh on mobile
    minHeight: Platform.OS === 'web' ? undefined : 200, // Minimum height on mobile
  },
  modalScrollView: {
    flex: 1, // Take all available space in modalBody
    maxHeight: Platform.OS === 'web' ? undefined : undefined, // Remove maxHeight constraint on mobile
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, // Extra padding for iOS safe area
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  matterportAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  matterportAppButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  measurementsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  measurementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  measurementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  measurementCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    paddingTop: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 100,
    justifyContent: 'flex-start',
    gap: 4,
  },
  measurementLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginTop: 0,
  },
  measurementSubValue: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
