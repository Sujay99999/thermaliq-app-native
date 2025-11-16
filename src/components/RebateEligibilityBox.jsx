import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function RebateEligibilityBox({ eligibility = {} }) {
  const [expanded, setExpanded] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0.3));
  const [borderAnim] = useState(new Animated.Value(0));

  const {
    federalEligibility = false,
    federalReason = '',
    stateEligibility = false,
    stateReason = '',
  } = eligibility || {};

  // If no eligibility data, show default message
  const hasEligibilityData = eligibility && Object.keys(eligibility).length > 0;

  // Pulsing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Glow animation
  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glow.start();

    return () => glow.stop();
  }, []);

  // Pulsing border animation
  useEffect(() => {
    const border = Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    border.start();

    return () => border.stop();
  }, []);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 215, 0, 1)'],
  });

  const hasAnyEligibility = federalEligibility || stateEligibility;

  // Always show the box - it will display default values if no data
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
          borderWidth: 3,
          borderColor: borderColor,
        },
      ]}
    >
      <LinearGradient
        colors={
          hasAnyEligibility
            ? ['#10b981', '#059669', '#047857']
            : ['#F59E0B', '#D97706', '#B45309']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowOverlay,
            {
              opacity: glowAnim,
            },
          ]}
        />

        {!expanded ? (
          // Collapsed state - CTA
          <TouchableOpacity
            onPress={() => setExpanded(true)}
            style={styles.collapsedContent}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="trophy"
                size={48}
                color="#fff"
                style={styles.icon}
              />
              <View style={styles.sparkle}>
                <Ionicons name="sparkles" size={24} color="#FFD700" />
              </View>
            </View>
            <Text style={styles.ctaTitle}>
              Click to see if you're eligible for HVAC rebates!
            </Text>
            <Text style={styles.ctaSubtitle}>
              Federal & State tax credits up to $3,200/year
            </Text>
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-down" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          // Expanded state - Details
          <View style={styles.expandedContent}>
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.expandedHeader}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
              <Text style={styles.expandedTitle}>Rebate Eligibility</Text>
            </View>

            {/* Federal Eligibility */}
            <View style={styles.eligibilitySection}>
              <View style={styles.eligibilityHeader}>
                <View style={styles.flagIcon}>
                  <Ionicons name="flag" size={20} color="#fff" />
                </View>
                <Text style={styles.sectionTitle}>Federal Eligibility</Text>
                <View
                  style={[
                    styles.statusBadge,
                    federalEligibility
                      ? styles.statusBadgeSuccess
                      : styles.statusBadgeFailure,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {federalEligibility ? 'YES' : 'NO'}
                  </Text>
                </View>
              </View>
              <Text style={styles.reasonText}>{federalReason}</Text>
              {federalEligibility && (
                <View style={styles.detailsBox}>
                  <Text style={styles.detailsTitle}>Federal Credit Details:</Text>
                  <Text style={styles.detailsText}>
                    • Up to 30% of project cost{'\n'}
                    • Heat pump credit capped at $2,000{'\n'}
                    • Total annual cap: $3,200{'\n'}
                    • Valid through 12/31/2025{'\n'}
                    • Claim via IRS Form 5695
                  </Text>
                </View>
              )}
            </View>

            {/* State Eligibility */}
            <View style={styles.eligibilitySection}>
              <View style={styles.eligibilityHeader}>
                <View style={styles.stateIcon}>
                  <Ionicons name="location" size={20} color="#fff" />
                </View>
                <Text style={styles.sectionTitle}>State Eligibility</Text>
                <View
                  style={[
                    styles.statusBadge,
                    stateEligibility
                      ? styles.statusBadgeSuccess
                      : styles.statusBadgeFailure,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {stateEligibility ? 'YES' : 'NO'}
                  </Text>
                </View>
              </View>
              <Text style={styles.reasonText}>{stateReason}</Text>
            </View>

            {/* Action Button */}
            {hasAnyEligibility && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document-text" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>
                  Learn More About Rebates
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    borderRadius: 17, // Slightly smaller to account for border
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: '#FFD700',
    borderRadius: 200,
    opacity: 0.3,
  },
  collapsedContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  icon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  arrowContainer: {
    marginTop: 8,
  },
  expandedContent: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  expandedHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  expandedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  eligibilitySection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  eligibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  flagIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  statusBadgeSuccess: {
    backgroundColor: '#10b981',
  },
  statusBadgeFailure: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  reasonText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    opacity: 0.95,
  },
  detailsBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 18,
    opacity: 0.9,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

