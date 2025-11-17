# Matterport SDK Implementation Guide

## Overview

This guide outlines the steps to integrate Matterport SDK into the React Native/Expo frontend component. Based on the research, Matterport SDK is primarily designed for web applications, so we'll need to use a WebView approach for React Native.

## Important Considerations

⚠️ **Key Limitations:**
- Matterport SDK is **web-based** (JavaScript/HTML)
- React Native requires **WebView** for web SDK integration
- Matterport requires **360° scanning** (not simple photo upload)
- You need a **Matterport account** and **SDK Application Key**
- You need a **Model SID** (Space ID) from a Matterport scan

## Prerequisites

1. **Matterport Account Setup:**
   - Sign up at https://matterport.com
   - Go to Developer Tools section in account settings
   - Request an **SDK Application Key**
   - Create or obtain a **Model SID** (Space ID) from a Matterport scan

2. **Project Dependencies:**
   - React Native WebView (for embedding web SDK)
   - Expo WebView (if using Expo)

## Implementation Steps

### Step 1: Install Required Dependencies

For React Native/Expo, you'll need WebView support:

```bash
# For Expo projects
npx expo install react-native-webview

# Or if using bare React Native
npm install react-native-webview
# For iOS: cd ios && pod install
```

### Step 2: Create Web HTML Template

Create a web HTML file that will be loaded in the WebView. This file will contain the Matterport SDK integration.

**File: `thermaliq-app-native/src/components/matterport/MatterportViewer.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matterport Viewer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #matterport-container {
            width: 100%;
            height: 100vh;
        }
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            color: #666;
        }
    </style>
</head>
<body>
    <div id="matterport-container">
        <div class="loading">Loading Matterport Viewer...</div>
    </div>

    <!-- Matterport SDK Script -->
    <script src="https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js"></script>
    
    <script>
        // Get parameters from URL or window
        const urlParams = new URLSearchParams(window.location.search);
        const modelSid = urlParams.get('m') || window.MODEL_SID || 'YOUR_MODEL_SID';
        const applicationKey = urlParams.get('key') || window.APPLICATION_KEY || 'YOUR_APPLICATION_KEY';

        // Initialize Matterport SDK
        let mpSdk;
        
        async function initMatterport() {
            try {
                const container = document.getElementById('matterport-container');
                
                // Create iframe for Matterport viewer
                const iframe = document.createElement('iframe');
                iframe.id = 'showcase';
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.style.border = 'none';
                iframe.src = `https://my.matterport.com/showcase/embed?m=${modelSid}&applicationKey=${applicationKey}`;
                iframe.allowFullscreen = true;
                iframe.setAttribute('allow', 'xr-spatial-tracking');
                
                container.innerHTML = '';
                container.appendChild(iframe);

                // Wait for iframe to load
                iframe.addEventListener('load', async () => {
                    try {
                        // Connect to Matterport SDK
                        mpSdk = await iframe.contentWindow.MP_SDK.connect(
                            iframe,
                            applicationKey
                        );
                        
                        console.log('Matterport SDK connected successfully');
                        
                        // Send message to React Native that SDK is ready
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'SDK_READY',
                                success: true
                            }));
                        }
                        
                        // Example: Listen for SDK events
                        setupSDKListeners();
                        
                    } catch (error) {
                        console.error('Error connecting to Matterport SDK:', error);
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'SDK_ERROR',
                                error: error.message
                            }));
                        }
                    }
                });
                
            } catch (error) {
                console.error('Error initializing Matterport:', error);
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'INIT_ERROR',
                        error: error.message
                    }));
                }
            }
        }

        function setupSDKListeners() {
            // Example SDK event listeners
            if (mpSdk) {
                // Listen for camera changes
                mpSdk.Camera.on('change', (camera) => {
                    console.log('Camera changed:', camera);
                });
                
                // Listen for mode changes
                mpSdk.Mode.on('change', (mode) => {
                    console.log('Mode changed:', mode);
                });
            }
        }

        // Initialize when page loads
        window.addEventListener('DOMContentLoaded', initMatterport);
        
        // Handle messages from React Native
        window.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                handleMessageFromReactNative(data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        function handleMessageFromReactNative(data) {
            if (!mpSdk) return;
            
            switch (data.action) {
                case 'navigateTo':
                    // Navigate to a specific position
                    mpSdk.Camera.moveTo(data.position);
                    break;
                case 'setMode':
                    // Change viewer mode
                    mpSdk.Mode.set(data.mode);
                    break;
                case 'getMeasurements':
                    // Get measurements (if available)
                    // Note: This requires Matterport Pro features
                    break;
                default:
                    console.log('Unknown action:', data.action);
            }
        }
    </script>
</body>
</html>
```

### Step 3: Create React Native Component

**File: `thermaliq-app-native/src/components/matterport/MatterportViewer.jsx`**

```jsx
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

export default function MatterportViewer({ 
  modelSid, 
  applicationKey, 
  onSDKReady,
  onError 
}) {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load HTML file
  const loadHTML = async () => {
    try {
      // For Expo, you can bundle the HTML as an asset
      // Or use a remote URL, or inline HTML string
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { width: 100%; height: 100%; overflow: hidden; }
            #container { width: 100%; height: 100vh; }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script src="https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js"></script>
          <script>
            const modelSid = '${modelSid}';
            const applicationKey = '${applicationKey}';
            
            async function init() {
              const container = document.getElementById('container');
              const iframe = document.createElement('iframe');
              iframe.width = '100%';
              iframe.height = '100%';
              iframe.style.border = 'none';
              iframe.src = \`https://my.matterport.com/showcase/embed?m=\${modelSid}&applicationKey=\${applicationKey}\`;
              iframe.allowFullscreen = true;
              iframe.setAttribute('allow', 'xr-spatial-tracking');
              container.appendChild(iframe);
              
              iframe.addEventListener('load', async () => {
                try {
                  const mpSdk = await iframe.contentWindow.MP_SDK.connect(iframe, applicationKey);
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'SDK_READY',
                      success: true
                    }));
                  }
                } catch (err) {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'SDK_ERROR',
                      error: err.message
                    }));
                  }
                }
              });
            }
            init();
          </script>
        </body>
        </html>
      `;
      
      return htmlContent;
    } catch (err) {
      console.error('Error loading HTML:', err);
      throw err;
    }
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'SDK_READY':
          setLoading(false);
          if (onSDKReady) onSDKReady();
          break;
        case 'SDK_ERROR':
        case 'INIT_ERROR':
          setLoading(false);
          setError(data.error || 'Failed to initialize Matterport SDK');
          if (onError) onError(data.error);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  };

  const sendMessageToWebView = (message) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  };

  // Expose method to parent component
  useEffect(() => {
    if (webViewRef.current && onSDKReady) {
      // You can expose methods via ref if needed
    }
  }, []);

  if (!modelSid || !applicationKey) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Missing Model SID or Application Key
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: await loadHTML() }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(`WebView error: ${nativeEvent.description}`);
          setLoading(false);
          if (onError) onError(nativeEvent.description);
        }}
        onLoadEnd={() => {
          // Loading complete, but SDK might not be ready yet
        }}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Loading Matterport Viewer...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
```

### Step 4: Update RoomScan Component

**File: `thermaliq-app-native/src/screens/RoomScan.jsx`** (Updated)

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MatterportViewer from '../components/matterport/MatterportViewer';

// TODO: Replace with your actual Matterport credentials
const MATTERPORT_MODEL_SID = 'YOUR_MODEL_SID_HERE';
const MATTERPORT_APPLICATION_KEY = 'YOUR_APPLICATION_KEY_HERE';

export default function RoomScan() {
  const navigation = useNavigation();
  const [showViewer, setShowViewer] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const Container = Platform.OS === 'web' ? View : LinearGradient;
  const containerProps = Platform.OS === 'web' 
    ? { style: [styles.container, { backgroundColor: '#E3F2FD' }] }
    : { colors: ['#E3F2FD', '#BBDEFB'], style: styles.container };

  const handleStartScan = () => {
    // Check if credentials are set
    if (MATTERPORT_MODEL_SID === 'YOUR_MODEL_SID_HERE' || 
        MATTERPORT_APPLICATION_KEY === 'YOUR_APPLICATION_KEY_HERE') {
      Alert.alert(
        'Configuration Required',
        'Please configure your Matterport Model SID and Application Key in RoomScan.jsx',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowViewer(true);
  };

  const handleSDKReady = () => {
    setSdkReady(true);
    console.log('Matterport SDK is ready');
  };

  const handleError = (error) => {
    Alert.alert('Error', `Failed to load Matterport viewer: ${error}`, [
      { text: 'OK', onPress: () => setShowViewer(false) }
    ]);
  };

  if (showViewer) {
    return (
      <View style={styles.viewerContainer}>
        <MatterportViewer
          modelSid={MATTERPORT_MODEL_SID}
          applicationKey={MATTERPORT_APPLICATION_KEY}
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
```

### Step 5: Install WebView Dependency

Run the installation command:

```bash
cd thermaliq-app-native
npx expo install react-native-webview
```

### Step 6: Configure Environment Variables (Optional but Recommended)

Create a config file for Matterport credentials:

**File: `thermaliq-app-native/src/config/matterport.js`**

```javascript
// Matterport Configuration
// Get these from your Matterport account:
// 1. Application Key: Developer Tools section in Matterport account
// 2. Model SID: From a Matterport scan (Space ID)

export const MATTERPORT_CONFIG = {
  APPLICATION_KEY: process.env.EXPO_PUBLIC_MATTERPORT_APP_KEY || 'YOUR_APPLICATION_KEY',
  // Model SID should be obtained dynamically from your backend or user input
  DEFAULT_MODEL_SID: process.env.EXPO_PUBLIC_MATTERPORT_MODEL_SID || null,
};

// Helper function to validate configuration
export function validateMatterportConfig(modelSid) {
  if (!MATTERPORT_CONFIG.APPLICATION_KEY || MATTERPORT_CONFIG.APPLICATION_KEY === 'YOUR_APPLICATION_KEY') {
    throw new Error('Matterport Application Key not configured');
  }
  if (!modelSid) {
    throw new Error('Model SID is required');
  }
  return true;
}
```

## Alternative: Using Matterport Capture SDK

If you want users to **create scans** within your app (not just view them), you'll need to integrate the Matterport Capture SDK, which is different from the Showcase SDK.

### Matterport Capture SDK (For Creating Scans)

1. **iOS**: Use Matterport Capture SDK for iOS
2. **Android**: Use Matterport Capture SDK for Android
3. **Web**: Not available (mobile-only)

This requires:
- Native module integration
- Matterport Capture SDK license
- More complex setup

## Testing Steps

1. **Get Matterport Credentials:**
   - Sign up at https://matterport.com
   - Create a free account
   - Go to Developer Tools → Request SDK Key
   - Create a test scan using Matterport Capture app
   - Get the Model SID from the scan

2. **Update Configuration:**
   - Replace `YOUR_MODEL_SID_HERE` with actual Model SID
   - Replace `YOUR_APPLICATION_KEY_HERE` with actual Application Key

3. **Test the Integration:**
   - Run the app: `npm start`
   - Navigate to RoomScan screen
   - Click "View Matterport Scan"
   - Verify the viewer loads correctly

## Important Notes

1. **WebView Limitations:**
   - Some Matterport features may not work perfectly in WebView
   - Performance may vary on mobile devices
   - Requires internet connection

2. **SDK Version:**
   - Check Matterport documentation for latest SDK version
   - Update the SDK script URL in the HTML if needed

3. **Security:**
   - Never commit Application Keys to version control
   - Use environment variables or secure storage
   - Consider storing keys on backend and fetching via API

4. **Model SID Management:**
   - Model SIDs are unique to each scan
   - You'll need to store/retrieve Model SIDs from your backend
   - Consider allowing users to input Model SID or scan QR code

## Next Steps

1. ✅ Install `react-native-webview`
2. ✅ Create MatterportViewer component
3. ✅ Update RoomScan screen
4. ⏳ Get Matterport Application Key
5. ⏳ Create test Matterport scan
6. ⏳ Test integration
7. ⏳ Add error handling and loading states
8. ⏳ Integrate with backend API for Model SID management

## Resources

- [Matterport SDK Documentation](https://matterport.github.io/showcase-sdk/)
- [Matterport Developer Tools](https://support.matterport.com/s/article/API-SDK-Developer-Tools-Overview)
- [React Native WebView Docs](https://github.com/react-native-webview/react-native-webview)
- [Matterport Plans](https://matterport.com/plans)

