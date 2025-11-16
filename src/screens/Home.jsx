import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const content = (
    <View style={styles.content}>
      <Text style={styles.title}>THERMSOL.ai</Text>
      <Text style={styles.subtitle}>Physics-Powered HVAC Optimization</Text>
      <TouchableOpacity
        onPress={() => {
          console.log('Button pressed!');
          navigation.navigate('InputForm');
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: '#E3F2FD' }]}>
        {content}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
