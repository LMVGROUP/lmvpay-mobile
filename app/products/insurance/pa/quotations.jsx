import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for Personal Accident Insurance
const mockPlans = [
  {
    id: 'plan-1',
    name: 'Personal Shield Pro',
    company_name: 'SecureLife Insurance',
    premium: 299900, // ₹2999.00
    coverage_amount: 50000000, // ₹50,00,000
    features: [
      'Accidental Death Coverage',
      'Permanent Total Disability',
      'Temporary Total Disability',
      'Medical Expenses Reimbursement',
      '24/7 Emergency Support',
    ],
    add_ons: [
      {
        id: 'addon-1',
        name: 'Critical Illness',
        price: 50000, // ₹500
        description: 'Coverage for 30 critical illnesses',
      },
      {
        id: 'addon-2',
        name: 'Hospital Cash',
        price: 30000, // ₹300
        description: 'Daily hospital cash allowance',
      },
      {
        id: 'addon-3',
        name: 'Family Coverage',
        price: 75000, // ₹750
        description: 'Extend coverage to family members',
      },
    ],
    highlights: ['Worldwide coverage', 'No medical checkup', 'Fast claim settlement', 'Flexible payment options'],
  },
  {
    id: 'plan-2',
    name: 'Accident Protection Basic',
    company_name: 'SafeGuard Assurance',
    premium: 199900, // ₹1999.00
    coverage_amount: 30000000, // ₹30,00,000
    features: [
      'Accidental Death Coverage',
      'Permanent Total Disability',
      'Basic Medical Expenses',
      'Ambulance Charges',
    ],
    add_ons: [
      {
        id: 'addon-4',
        name: 'Natural Disaster',
        price: 40000, // ₹400
        description: 'Coverage for natural disasters',
      },
      {
        id: 'addon-5',
        name: 'Education Benefit',
        price: 60000, // ₹600
        description: 'Education fund for children',
      },
    ],
    highlights: ['Affordable premium', 'Simple documentation', 'Online purchase', 'Renewal discount'],
  },
  {
    id: 'plan-3',
    name: 'Premium Accident Guard',
    company_name: 'TotalProtect Group',
    premium: 499900, // ₹4999.00
    coverage_amount: 100000000, // ₹1,00,00,000
    features: [
      'Accidental Death Coverage',
      'Permanent Total & Partial Disability',
      'Full Medical Expenses',
      'Emergency Evacuation',
      'Legal Assistance',
      'Travel Assistance',
      'Premium 24/7 Support',
    ],
    add_ons: [
      {
        id: 'addon-6',
        name: 'Premium Health Checkup',
        price: 100000, // ₹1000
        description: 'Annual comprehensive health checkup',
      },
      {
        id: 'addon-7',
        name: 'International Coverage',
        price: 150000, // ₹1500
        description: 'Worldwide accident coverage',
      },
      {
        id: 'addon-8',
        name: 'Income Protection',
        price: 120000, // ₹1200
        description: 'Monthly income during recovery',
      },
    ],
    highlights: ['High sum insured', 'Global coverage', 'Air ambulance', 'Rehabilitation support', 'Tax benefits'],
  },
];

export default function PersonalAccidentQuotations() {
  const router = useRouter();
  const { formId } = useLocalSearchParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [submittingPlan, setSubmittingPlan] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState({});

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlans(mockPlans);
      const initialAddOns = {};
      mockPlans.forEach((plan) => {
        initialAddOns[plan.id] = new Set();
      });
      setSelectedAddOns(initialAddOns);
      setLoading(false);
    }, 500);
  }, []);

  const toggleAddOn = (planId, addOnId) => {
    setSelectedAddOns((prev) => {
      const planAddOns = new Set(prev[planId] || []);
      if (planAddOns.has(addOnId)) {
        planAddOns.delete(addOnId);
      } else {
        planAddOns.add(addOnId);
      }
      return { ...prev, [planId]: planAddOns };
    });
  };

  const togglePlanExpansion = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const calculateTotalPremium = (plan) => {
    let total = plan.premium;
    const selectedIds = selectedAddOns[plan.id] || new Set();
    plan.add_ons.forEach((addOn) => {
      if (selectedIds.has(addOn.id)) {
        total += addOn.price;
      }
    });
    return total;
  };

  const handleSelectPlan = async (plan) => {
    if (!formId) {
      Alert.alert('Error', 'Form ID not found');
      return;
    }

    setSubmittingPlan(plan.id);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedIds = Array.from(selectedAddOns[plan.id] || []);
      const selectedAddOnsList = plan.add_ons.filter((ao) =>
        selectedIds.includes(ao.id)
      );
      const totalPremium = calculateTotalPremium(plan);

      console.log('Selected Plan:', {
        form_id: formId,
        plan_id: plan.id,
        selected_add_ons: selectedAddOnsList,
        total_premium: totalPremium,
      });

      Alert.alert('Success', 'Plan selected successfully!', [
        {
          text: 'Continue',
          onPress: () => router.push('/'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to select plan');
    } finally {
      setSubmittingPlan(null);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 100).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading insurance plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const PlanCard = ({ plan, index }) => {
    const isExpanded = expandedPlans[plan.id];
    const totalPremium = calculateTotalPremium(plan);

    return (
      <View style={styles.planCard}>
        <View style={styles.cardHeader}>
          <View style={styles.planTitleRow}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#fff" />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.companyName}>{plan.company_name}</Text>
            </View>
          </View>
          {index === 0 && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>POPULAR</Text>
            </View>
          )}
        </View>

        <View style={styles.premiumSection}>
          <View>
            <Text style={styles.premiumLabel}>Annual Premium</Text>
            <View style={styles.premiumRow}>
              <Text style={styles.premiumAmount}>
                {formatCurrency(plan.premium)}
              </Text>
              <Text style={styles.premiumUnit}>per year</Text>
            </View>
          </View>
          <View style={styles.coverageBox}>
            <Text style={styles.coverageLabel}>Coverage</Text>
            <Text style={styles.coverageAmount}>
              {formatCurrency(plan.coverage_amount)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => togglePlanExpansion(plan.id)}
        >
          <MaterialIcons
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color="#007AFF"
          />
          <Text style={styles.expandText}>
            {isExpanded ? 'Show less' : 'View details'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.featuresSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Included Features</Text>
              </View>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <MaterialIcons name="check" size={18} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.addOnsSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="add-circle" size={20} color="#FF9800" />
                <Text style={styles.sectionTitle}>Additional Add-ons</Text>
              </View>
              {plan.add_ons.map((addOn) => {
                const isSelected = (selectedAddOns[plan.id] || new Set()).has(addOn.id);
                return (
                  <TouchableOpacity
                    key={addOn.id}
                    style={[
                      styles.addOnItem,
                      isSelected && styles.addOnItemSelected,
                    ]}
                    onPress={() => toggleAddOn(plan.id, addOn.id)}
                  >
                    <MaterialIcons
                      name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                      size={24}
                      color={isSelected ? '#007AFF' : '#ccc'}
                    />
                    <View style={styles.addOnContent}>
                      <Text style={styles.addOnName}>{addOn.name}</Text>
                      <Text style={styles.addOnDescription}>
                        {addOn.description}
                      </Text>
                    </View>
                    <Text style={styles.addOnPrice}>
                      +{formatCurrency(addOn.price)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.highlightsSection}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="star-circle" size={20} color="#FFC107" />
                <Text style={styles.sectionTitle}>Key Highlights</Text>
              </View>
              <View style={styles.highlightsGrid}>
                {plan.highlights.map((highlight, idx) => (
                  <View key={idx} style={styles.highlightItem}>
                    <MaterialIcons name="star" size={16} color="#FFC107" />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Premium</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalPremium)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.selectButton,
              submittingPlan === plan.id && styles.selectButtonDisabled,
            ]}
            onPress={() => handleSelectPlan(plan)}
            disabled={submittingPlan === plan.id}
          >
            {submittingPlan === plan.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.selectButtonText}>Select Plan</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Personal Accident Plans</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="shield-account" size={24} color="#0066FF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Choose Your Accident Plan</Text>
              <Text style={styles.infoText}>
                Compare and select the best personal accident insurance plan
              </Text>
            </View>
          </View>

          <View style={styles.plansList}>
            {plans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </View>

          <View style={styles.footerNote}>
            <MaterialCommunityIcons name="shield-check" size={32} color="#E3F2FD" />
            <Text style={styles.footerText}>
              All plans include 24/7 emergency support and fast claim settlement
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066FF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#0066FF',
  },
  plansList: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badge: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
  },
  popularBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  premiumSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  premiumLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  premiumRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  premiumAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginRight: 8,
  },
  premiumUnit: {
    fontSize: 14,
    color: '#666',
  },
  coverageBox: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  coverageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  coverageAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  expandText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  expandedContent: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 12,
    flex: 1,
  },
  addOnsSection: {
    marginBottom: 20,
  },
  addOnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addOnItemSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#007AFF',
  },
  addOnContent: {
    flex: 1,
    marginLeft: 12,
  },
  addOnName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addOnDescription: {
    fontSize: 12,
    color: '#666',
  },
  addOnPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  highlightsSection: {
    marginBottom: 16,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
    flex: 1,
    minWidth: '45%',
  },
  highlightText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 140,
    justifyContent: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: '#999',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});