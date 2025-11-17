import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Conditionally import MatterportViewer (works on all platforms now)
let MatterportViewer = null;
let MATTERPORT_CONFIG = null;
let validateMatterportConfig = null;

try {
  MatterportViewer = require('../components/matterport/MatterportViewer').default;
  const matterportConfig = require('../config/matterport');
  MATTERPORT_CONFIG = matterportConfig.MATTERPORT_CONFIG;
  validateMatterportConfig = matterportConfig.validateMatterportConfig;
} catch (e) {
  console.warn('Matterport components not available:', e.message);
}

// TODO: Replace with your actual Matterport Model SID
// You can get this from a Matterport scan or allow users to input it
const MATTERPORT_MODEL_SID = MATTERPORT_CONFIG?.DEFAULT_MODEL_SID || 'YOUR_MODEL_SID_HERE';

export default function RoomScan() {
  const navigation = useNavigation();
  const [showViewer, setShowViewer] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const Container = Platform.OS === 'web' ? View : LinearGradient;
  const containerProps = Platform.OS === 'web' 
    ? { style: [styles.container, { backgroundColor: '#E3F2FD' }] }
    : { colors: ['#E3F2FD', '#BBDEFB'], style: styles.container };

  const handleStartScan = () => {
    if (!MatterportViewer || !validateMatterportConfig) {
      Alert.alert(
        'Matterport Not Available',
        'Matterport viewer is not available on this platform or not properly configured.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      // Validate configuration
      validateMatterportConfig(MATTERPORT_MODEL_SID);
      setShowViewer(true);
    } catch (error) {
      Alert.alert(
        'Configuration Required',
        error.message + '\n\nPlease configure your Matterport credentials in src/config/matterport.js',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSDKReady = () => {
    setSdkReady(true);
    console.log('Matterport SDK is ready');
  };

  const handleError = (error) => {
    Alert.alert(
      'Error Loading Matterport Viewer',
      error || 'Failed to load Matterport viewer. Please check your credentials and internet connection.',
      [{ text: 'OK', onPress: () => setShowViewer(false) }]
    );
  };

  // Show Matterport viewer if active
  if (showViewer && MatterportViewer) {
    return (
      <View style={styles.viewerContainer}>
        <MatterportViewer
          modelSid={MATTERPORT_MODEL_SID}
          applicationKey={MATTERPORT_CONFIG?.APPLICATION_KEY}
          onSDKReady={handleSDKReady}
          onError={handleError}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowViewer(false)}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Container {...containerProps}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="cube" size={80} color="#1976D2" />
          <Text style={styles.title}>Room Scanning</Text>
          <Text style={styles.subtitle}>
            View your Matterport 3D room scan
          </Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ About Matterport Scanning</Text>
          <Text style={styles.infoText}>
            • Requires Matterport Capture app to create scans{'\n'}
            • Walk around room with smartphone to capture 360° images{'\n'}
            • Generates accurate 3D models and measurements{'\n'}
            • Free tier available (limited to 1 active space)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleStartScan}
        >
          <Ionicons name="cube-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>View Matterport Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('InputForm')}
        >
          <Ionicons name="arrow-forward" size={24} color="#1976D2" />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Use Manual Input Instead
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    minWidth: 200,
    justifyContent: 'center',
    marginTop: 24,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#1976D2',
  },
  infoBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
});

