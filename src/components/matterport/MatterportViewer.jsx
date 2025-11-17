import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform, TouchableOpacity } from 'react-native';

// Conditionally import WebView only on native platforms
let WebView = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('react-native-webview not installed. Install with: npx expo install react-native-webview');
  }
}

export default function MatterportViewer({ 
  modelSid, 
  applicationKey, 
  onSDKReady,
  onError 
}) {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate HTML content with Matterport SDK
  const getHTMLContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 100%; height: 100%; overflow: hidden; }
          #container { width: 100%; height: 100vh; }
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
        <div id="container">
          <div class="loading">Loading Matterport Viewer...</div>
        </div>
        <script src="https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js"></script>
        <script>
          const modelSid = '${modelSid}';
          const applicationKey = '${applicationKey}';
          let mpSdk = null;
          
          async function initMatterport() {
            try {
              const container = document.getElementById('container');
              container.innerHTML = '';
              
              const iframe = document.createElement('iframe');
              iframe.id = 'showcase';
              iframe.width = '100%';
              iframe.height = '100%';
              iframe.style.border = 'none';
              iframe.src = \`https://my.matterport.com/showcase/embed?m=\${modelSid}&applicationKey=\${applicationKey}\`;
              iframe.allowFullscreen = true;
              iframe.setAttribute('allow', 'xr-spatial-tracking');
              container.appendChild(iframe);
              
              iframe.addEventListener('load', async () => {
                try {
                  mpSdk = await iframe.contentWindow.MP_SDK.connect(iframe, applicationKey);
                  console.log('Matterport SDK connected successfully');
                  
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'SDK_READY',
                      success: true
                    }));
                  }
                  
                  // Setup SDK event listeners
                  setupSDKListeners();
                  
                } catch (err) {
                  console.error('Error connecting to Matterport SDK:', err);
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'SDK_ERROR',
                      error: err.message || 'Failed to connect to Matterport SDK'
                    }));
                  }
                }
              });
              
              iframe.addEventListener('error', (err) => {
                console.error('Iframe load error:', err);
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'INIT_ERROR',
                    error: 'Failed to load Matterport iframe'
                  }));
                }
              });
              
            } catch (err) {
              console.error('Error initializing Matterport:', err);
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'INIT_ERROR',
                  error: err.message || 'Failed to initialize Matterport'
                }));
              }
            }
          }
          
          function setupSDKListeners() {
            if (!mpSdk) return;
            
            try {
              // Listen for camera changes
              mpSdk.Camera.on('change', (camera) => {
                console.log('Camera changed:', camera);
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'CAMERA_CHANGED',
                    camera: camera
                  }));
                }
              });
              
              // Listen for mode changes
              mpSdk.Mode.on('change', (mode) => {
                console.log('Mode changed:', mode);
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'MODE_CHANGED',
                    mode: mode
                  }));
                }
              });
            } catch (err) {
              console.error('Error setting up SDK listeners:', err);
            }
          }
          
          // Handle messages from React Native
          window.addEventListener('message', (event) => {
            try {
              const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
              handleMessageFromReactNative(data);
            } catch (err) {
              console.error('Error parsing message from React Native:', err);
            }
          });
          
          function handleMessageFromReactNative(data) {
            if (!mpSdk) {
              console.warn('SDK not ready, cannot handle message:', data);
              return;
            }
            
            try {
              switch (data.action) {
                case 'navigateTo':
                  if (data.position) {
                    mpSdk.Camera.moveTo(data.position);
                  }
                  break;
                case 'setMode':
                  if (data.mode) {
                    mpSdk.Mode.set(data.mode);
                  }
                  break;
                case 'getCurrentCamera':
                  mpSdk.Camera.get().then((camera) => {
                    if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'CAMERA_DATA',
                        camera: camera
                      }));
                    }
                  });
                  break;
                default:
                  console.log('Unknown action:', data.action);
              }
            } catch (err) {
              console.error('Error handling message:', err);
            }
          }
          
          // Initialize when page loads
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMatterport);
          } else {
            initMatterport();
          }
        </script>
      </body>
      </html>
    `;
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
          const errorMsg = data.error || 'Failed to initialize Matterport SDK';
          setError(errorMsg);
          if (onError) onError(errorMsg);
          break;
        case 'CAMERA_CHANGED':
        case 'MODE_CHANGED':
          // Handle SDK events if needed
          console.log('SDK Event:', data.type, data);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  };

  // Method to send commands to Matterport SDK
  // This can be called from parent component if needed
  const sendCommand = (action, payload = {}) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        action,
        ...payload
      }));
    }
  };

  if (!modelSid || !applicationKey) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Missing Model SID or Application Key
        </Text>
      </View>
    );
  }

  // Web platform: Show message (WebView not available on web)
  // For web, you would need to use a different approach or redirect to Matterport URL
  if (Platform.OS === 'web') {
    const embedUrl = `https://my.matterport.com/showcase/embed?m=${modelSid}&applicationKey=${applicationKey}`;
    return (
      <View style={styles.container}>
        <View style={styles.webMessageContainer}>
          <Text style={styles.webMessageTitle}>Matterport Viewer</Text>
          <Text style={styles.webMessageText}>
            Matterport 3D viewer is best experienced on native platforms (iOS/Android).
            {'\n\n'}
            For web, please use the Matterport website directly.
          </Text>
          <TouchableOpacity
            style={styles.webButton}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.open(`https://my.matterport.com/showcase/?m=${modelSid}`, '_blank');
              }
            }}
          >
            <Text style={styles.webButtonText}>Open in Matterport</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Native platform: Use WebView
  if (!WebView) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          WebView not available. Please install react-native-webview:
          {'\n'}npx expo install react-native-webview
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getHTMLContent() }}
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
          const errorMsg = `WebView error: ${nativeEvent.description}`;
          setError(errorMsg);
          setLoading(false);
          if (onError) onError(errorMsg);
        }}
        onLoadEnd={() => {
          // WebView loaded, but SDK might not be ready yet
          // SDK_READY message will be sent when SDK is actually ready
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          const errorMsg = `HTTP error: ${nativeEvent.statusCode}`;
          setError(errorMsg);
          setLoading(false);
          if (onError) onError(errorMsg);
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
    zIndex: 1000,
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
    zIndex: 1000,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  webMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  webMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  webMessageText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  webButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  webButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

