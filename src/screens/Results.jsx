import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ComparisonTable from '../components/ComparisonTable';
import ScenarioSimulator from '../components/ScenarioSimulator';

export default function Results() {
  const navigation = useNavigation();
  const route = useRoute();
  const formData = route.params?.formData || {};
  const results = route.params?.results || {
    action: 'SETBACK',
    setbackTemp: 78,
    desiredTemp: formData.desiredTemp || 72,
    outdoorTemp: formData.outdoorTemp || 85,
    restartTime: '4:15 PM',
    returnTime: '5:00 PM',
    recoveryTime: 45,
    thermalTimeConstant: 3.5,
    breakEvenTime: 8.8,
    savingsPerDay: 1.80,
    savingsPerMonth: 39.60,
    savingsPerYear: 468,
    energySavedKwh: 1.8,
    percentSaved: 13.3
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#1976D2" />
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Personalized HVAC Strategy</Text>
          <Text style={styles.subtitle}>
            Based on your building's unique thermal properties
          </Text>
        </View>

        {/* Main Recommendation Card */}
        <LinearGradient
          colors={['#1976D2', '#42A5F5']}
          style={styles.recommendationCard}
        >
          <View style={styles.recommendationHeader}>
            <View style={styles.recommendationContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ RECOMMENDED STRATEGY</Text>
              </View>
              <Text style={styles.recommendationTitle}>
                {results.action === 'SETBACK' ? 'Use Temperature Setback' : 'Maintain Temperature'}
              </Text>
            </View>
            <Ionicons name="trending-down" size={64} color="#fff" style={{ opacity: 0.8 }} />
          </View>

          {results.action === 'SETBACK' ? (
            <View style={styles.setbackInfo}>
              <Text style={styles.setbackText}>
                When you leave at <Text style={styles.boldText}>{formData.absenceStartTime || '8:00 AM'}</Text>:
              </Text>
              <View style={styles.tempContainer}>
                <View style={styles.tempBox}>
                  <Text style={styles.tempLabel}>Set thermostat to</Text>
                  <Text style={styles.tempValue}>{results.setbackTemp}°F</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.tempBox}>
                  <Text style={styles.tempLabel}>HVAC restarts at</Text>
                  <Text style={styles.timeValue}>{results.restartTime}</Text>
                </View>
              </View>
              <Text style={styles.comfortText}>
                Your home will be comfortable at {results.desiredTemp}°F when you return at {results.returnTime}
              </Text>
            </View>
          ) : (
            <View style={styles.maintainInfo}>
              <Text style={styles.maintainText}>
                Keep your thermostat at <Text style={styles.maintainTemp}>{results.desiredTemp}°F</Text>
              </Text>
              <Text style={styles.maintainSubtext}>
                Your absence is too short for setback to save energy
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Savings Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="trending-down" size={24} color="#10b981" />
              </View>
              <Text style={styles.metricTitle}>Your Savings</Text>
            </View>
            <View style={styles.metricContent}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Per Day</Text>
                <Text style={styles.metricValueSuccess}>${results.savingsPerDay}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Per Month</Text>
                <Text style={styles.metricValue}>${results.savingsPerMonth}</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Per Year</Text>
                <Text style={styles.metricValue}>${results.savingsPerYear}</Text>
              </View>
            </View>
            <View style={styles.metricFooter}>
              <Text style={styles.metricFooterText}>
                Energy saved: <Text style={styles.boldText}>{results.energySavedKwh} kWh/day</Text>
              </Text>
            </View>
          </View>

          {/* Building Physics Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="time" size={24} color="#1976D2" />
              </View>
              <Text style={styles.metricTitle}>Building Physics</Text>
            </View>
            <View style={styles.metricContent}>
              <View style={styles.physicsItem}>
                <Text style={styles.physicsLabel}>Thermal Time Constant (τ)</Text>
                <Text style={styles.physicsValue}>{results.thermalTimeConstant} hours</Text>
                <Text style={styles.physicsDescription}>How fast your building changes temperature</Text>
              </View>
              <View style={styles.physicsItem}>
                <Text style={styles.physicsLabel}>Break-Even Time</Text>
                <Text style={styles.physicsValue}>{results.breakEvenTime} hours</Text>
                <Text style={styles.physicsDescription}>Minimum absence for savings</Text>
              </View>
            </View>
          </View>

          {/* Performance Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="flash" size={24} color="#fbbf24" />
              </View>
              <Text style={styles.metricTitle}>Performance</Text>
            </View>
            <View style={styles.metricContent}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Energy Reduction</Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${results.percentSaved}%` },
                    ]}
                  />
                </View>
                <Text style={styles.performanceValue}>{results.percentSaved}% saved</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Recovery Time</Text>
                <Text style={styles.performanceValue}>{results.recoveryTime} minutes</Text>
                <Text style={styles.performanceDescription}>Time to reach comfort temperature</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Scenario Simulator */}
        <View style={styles.section}>
          <ScenarioSimulator 
            initialFormData={formData}
            onScenarioChange={(newData) => {
              console.log('Scenario changed:', newData);
              // TODO: Recalculate results with new parameters
            }}
          />
        </View>

        {/* Comparison Table */}
        <View style={styles.section}>
          <ComparisonTable results={results} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('InputForm')}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Try Different Scenario</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
          >
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Download Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  recommendationCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  recommendationContent: {
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  setbackInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 24,
  },
  setbackText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  tempBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    flex: 1,
  },
  tempLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  tempValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  arrow: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.6,
  },
  comfortText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  maintainInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 24,
  },
  maintainText: {
    fontSize: 18,
    color: '#fff',
  },
  maintainTemp: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  maintainSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
  },
  metricsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  metricContent: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  metricValueSuccess: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  metricFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metricFooterText: {
    fontSize: 12,
    color: '#666',
  },
  physicsItem: {
    marginBottom: 16,
  },
  physicsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  physicsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  physicsDescription: {
    fontSize: 10,
    color: '#999',
  },
  performanceItem: {
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  performanceDescription: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#1976D2',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  primaryButtonText: {
    color: '#fff',
  },
});

