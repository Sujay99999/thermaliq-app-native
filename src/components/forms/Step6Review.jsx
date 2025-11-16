import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Step6Review({ formData = {}, errors = {} }) {
  const formatValue = (value, suffix = '') => {
    if (!value || value === '') return 'Not provided';
    return `${value}${suffix}`;
  };

  const formatCapitalize = (value) => {
    if (!value) return 'Not provided';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={64} color="#10b981" />
        <Text style={styles.title}>Review Your Information</Text>
        <Text style={styles.subtitle}>
          Check everything looks correct before we calculate
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location & Climate</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>ZIP Code:</Text>
              <Text style={styles.value}>{formatValue(formData.zipCode)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Outdoor Temp:</Text>
              <Text style={styles.value}>{formatValue(formData.outdoorTemp, '°F')}</Text>
            </View>
          </View>
        </View>

        {/* Building */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 Building Details</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Home Type:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.homeType)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Floor Area:</Text>
              <Text style={styles.value}>{formatValue(formData.floorArea, ' sq ft')}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Construction:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.constructionType)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Built:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.constructionEra)}</Text>
            </View>
          </View>
        </View>

        {/* Insulation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🪟 Insulation & HVAC</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Insulation:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.insulationQuality)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Windows:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.windowType)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>HVAC Type:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.hvacType)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>HVAC Age:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.hvacAge)}</Text>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Schedule</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Desired Temp:</Text>
              <Text style={styles.value}>{formatValue(formData.desiredTemp, '°F')}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Absence Duration:</Text>
              <Text style={styles.value}>{formatValue(formData.absenceDuration, ' hours')}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Leave Time:</Text>
              <Text style={styles.value}>{formatValue(formData.absenceStartTime)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Days Per Week:</Text>
              <Text style={styles.value}>{formatValue(formData.daysPerWeek, ' days')}</Text>
            </View>
          </View>
        </View>

        {/* Utility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Utility Costs</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Monthly Bill:</Text>
              <Text style={styles.value}>
                {formData.monthlyBill ? `$${formData.monthlyBill}` : 'Not provided'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Electricity Rate:</Text>
              <Text style={styles.value}>
                {formData.electricityRate ? `$${formData.electricityRate}/kWh` : 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tax Incentives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏛️ Tax Incentives (Optional)</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Homeowner:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.ownsHome)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Primary Residence:</Text>
              <Text style={styles.value}>{formatCapitalize(formData.primaryResidence)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Equipment Selected:</Text>
              <Text style={styles.value}>{(formData.equipmentSelected || []).length || 'None'} items</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Project Cost:</Text>
              <Text style={styles.value}>
                {formData.projectCost ? `$${formData.projectCost}` : 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        {/* Ready Message */}
        <View style={[styles.readyBox, { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }]}>
          <Text style={[styles.readyText, { color: '#1E3A8A' }]}>
            Ready to calculate your optimal HVAC strategy!
          </Text>
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
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  readyBox: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  readyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A8A',
    textAlign: 'center',
  },
});

