import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ComparisonTable({ results }) {
  const comparisonData = [
    {
      metric: 'Daily Energy Cost',
      maintain: '$2.26',
      setback: '$1.96',
      savings: '$0.30',
      better: 'setback'
    },
    {
      metric: 'Monthly Cost',
      maintain: '$49.72',
      setback: '$43.12',
      savings: '$6.60',
      better: 'setback'
    },
    {
      metric: 'Annual Cost',
      maintain: '$596',
      setback: '$518',
      savings: '$78',
      better: 'setback'
    },
    {
      metric: 'Energy per Day',
      maintain: '13.5 kWh',
      setback: '11.7 kWh',
      savings: '1.8 kWh',
      better: 'setback'
    },
    {
      metric: 'Comfort on Return',
      maintain: 'Immediate',
      setback: '45 min recovery',
      savings: '-',
      better: 'maintain'
    },
    {
      metric: 'Manual Adjustments',
      maintain: 'None needed',
      setback: 'Set before leaving',
      savings: '-',
      better: 'maintain'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Strategy Comparison</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.headerCell, { width: 120 }]}>
              <Text style={styles.headerText}>Metric</Text>
            </View>
            <View style={[styles.headerCell, { width: 120 }]}>
              <Text style={[styles.headerText, { color: '#EF4444' }]}>Maintain at 72°F</Text>
            </View>
            <View style={[styles.headerCell, { width: 120 }]}>
              <Text style={[styles.headerText, { color: '#10b981' }]}>Setback to 78°F</Text>
            </View>
            <View style={[styles.headerCell, { width: 100 }]}>
              <Text style={[styles.headerText, { color: '#1976D2' }]}>Savings</Text>
            </View>
          </View>

          {/* Rows */}
          {comparisonData.map((row, index) => (
            <View key={index} style={styles.dataRow}>
              <View style={[styles.dataCell, { width: 120 }]}>
                <Text style={styles.metricText}>{row.metric}</Text>
              </View>
              <View style={[styles.dataCell, { width: 120 }]}>
                <View style={styles.cellContent}>
                  {row.better === 'maintain' && (
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  )}
                  <Text style={[styles.cellText, row.better === 'maintain' && styles.betterText]}>
                    {row.maintain}
                  </Text>
                </View>
              </View>
              <View style={[styles.dataCell, { width: 120 }]}>
                <View style={styles.cellContent}>
                  {row.better === 'setback' && (
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  )}
                  <Text style={[
                    styles.cellText,
                    row.better === 'setback' && styles.betterTextSetback
                  ]}>
                    {row.setback}
                  </Text>
                </View>
              </View>
              <View style={[styles.dataCell, { width: 100 }]}>
                <Text style={[
                  styles.cellText,
                  row.savings !== '-' ? styles.savingsText : styles.noSavingsText
                ]}>
                  {row.savings}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
        <Text style={styles.footerText}>Best for this metric</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 8,
  },
  headerCell: {
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
  },
  dataCell: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  cellContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  betterText: {
    fontWeight: '600',
  },
  betterTextSetback: {
    fontWeight: '600',
    color: '#10b981',
  },
  savingsText: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  noSavingsText: {
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});

