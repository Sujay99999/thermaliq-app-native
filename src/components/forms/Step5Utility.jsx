import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Step5Utility({ formData, setFormData, errors = {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cash" size={64} color="#1976D2" />
        <Text style={styles.title}>Utility Costs</Text>
        <Text style={styles.subtitle}>
          Help us calculate your potential savings (optional)
        </Text>
      </View>

      <View style={styles.formCard}>
        {/* Monthly Electric Bill */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monthly Electric Bill (Optional)</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.iconText}>$</Text>
            <TextInput
              placeholder="150"
              value={formData.monthlyBill || ''}
              onChangeText={(text) => setFormData({ ...formData, monthlyBill: text })}
              style={styles.inputWithIconInput}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helperText}>
            We'll use this to show savings as a % of your bill
          </Text>
        </View>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Electricity Rate */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Electricity Rate ($/kWh) (Optional)</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.iconText}>$</Text>
            <TextInput
              placeholder="0.13"
              value={formData.electricityRate || ''}
              onChangeText={(text) => setFormData({ ...formData, electricityRate: text })}
              style={styles.inputWithIconInput}
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.helperText}>
            Check your utility bill for this rate
          </Text>
        </View>

        {/* Skip Option */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={styles.infoBold}>Don't know?</Text> No problem! We'll estimate based on your ZIP code.
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingLeft: 16,
  },
  iconText: {
    fontSize: 18,
    color: '#6B7280',
    marginRight: 8,
  },
  inputWithIconInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#fff',
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#1E3A8A',
  },
  infoBold: {
    fontWeight: 'bold',
  },
});

