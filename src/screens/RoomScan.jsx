import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function RoomScan() {
  const navigation = useNavigation();

  const Container = Platform.OS === 'web' ? View : LinearGradient;
  const containerProps = Platform.OS === 'web' 
    ? { style: [styles.container, { backgroundColor: '#E3F2FD' }] }
    : { colors: ['#E3F2FD', '#BBDEFB'], style: styles.container };

  return (
    <Container {...containerProps}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="cube" size={80} color="#1976D2" />
          <Text style={styles.title}>Room Scanning</Text>
          <Text style={styles.subtitle}>
            AR room scanning feature coming soon!
          </Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Manual Input Available</Text>
          <Text style={styles.infoText}>
            For now, you can manually enter your room dimensions and building details in the input form.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('InputForm')}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
          <Text style={styles.buttonText}>Go to Input Form</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 6,
  },
});

