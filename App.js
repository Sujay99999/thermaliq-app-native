import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
// import './src/index.css'; // Temporarily disabled for web - using StyleSheet instead

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      {Platform.OS !== 'web' && <StatusBar style="auto" />}
    </SafeAreaProvider>
  );
}
