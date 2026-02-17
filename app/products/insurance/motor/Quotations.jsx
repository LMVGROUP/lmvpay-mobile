import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = "#103d69";
const ACCENT_COLOR = "#2563eb";

const MOCK_QUOTES = [
  {
    id: 1,
    company: "HDFC ERGO",
    logo: "shield-checkmark",
    coverage: "Third Party",
    premium: 8999,
    idv: 265000,
    features: ["Cashless Garages: 4500+", "24/7 Claim Support"],
    rating: 4.5,
    claimSettlement: "98%"
  },
  {
    id: 2,
    company: "New India Assurance",
    logo: "shield-half",
    coverage: "Third Party",
    premium: 7500,
    idv: 245000,
    features: [ "Quick Claim Process", "Personal Accident Cover"],
    rating: 4.2,
    claimSettlement: "95%"
  },
  {
    id: 3,
    company: "Bajaj Allianz",
    logo: "shield-checkmark-outline",
    coverage: "Comprehensive",
    premium: 12999,
    idv: 265000,
    features: [ "Engine Protection", "Roadside Assistance"],
    rating: 4.7,
    claimSettlement: "99%"
  },
  {
    id: 4,
    company: "ICICI Lombard",
    logo: "shield",
    coverage: "Comprehensive",
    premium: 11899,
    idv: 240000,
    features: [ "Key Replacement", "Return to Invoice"],
    rating: 4.6,
    claimSettlement: "97%"
  }
];

const Quotations = () => {
    const router = useRouter();
  const [selectedPolicy, setSelectedPolicy] = useState('All');
  const [idvValue, setIdvValue] = useState(265000);
  const [quotes, setQuotes] = useState(MOCK_QUOTES);

  const policyTypes = ['All', 'Comprehensive', 'Third Party'];

  const filterQuotes = (type) => {
    setSelectedPolicy(type);
    if (type === 'All') {
      setQuotes(MOCK_QUOTES);
    } else {
      const filtered = MOCK_QUOTES.filter(q => q.coverage.includes(type));
      setQuotes(filtered);
    }
  };

  const handleBuy = ()=>{
    router.push("/products/insurance/motor/addOn")
  }

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const formatShortCurrency = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Insurance Quotes</Text>
            <View style={styles.quoteBadge}>
              <Feather name="file-text" size={12} color="#FFF" />
              <Text style={styles.quoteCount}>{quotes.length} quotes</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.filterIcon}>
            <Feather name="sliders" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Policy Type Filter */}
        <View style={styles.filterCard}>
          <View style={styles.filterHeader}>
            <Feather name="filter" size={16} color={PRIMARY_COLOR} />
            <Text style={styles.filterTitle}>Policy Type</Text>
          </View>
          <View style={styles.policyChipContainer}>
            {policyTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.policyChip,
                  selectedPolicy === type && styles.selectedPolicyChip
                ]}
                onPress={() => filterQuotes(type)}
              >
                {selectedPolicy === type && (
                  <Feather name="check" size={14} color="#FFF" style={{ marginRight: 4 }} />
                )}
                <Text style={[
                  styles.policyChipText,
                  selectedPolicy === type && styles.selectedPolicyChipText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Compact IDV Range Slider */}
        <View style={styles.sliderCard}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleRow}>
              <MaterialCommunityIcons name="cash" size={18} color={PRIMARY_COLOR} />
              <Text style={styles.sliderTitle}>IDV Range</Text>
            </View>
            <Text style={styles.selectedIdvValue}>{formatCurrency(Math.round(idvValue))}</Text>
          </View>
          
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={240000}
              maximumValue={320000}
              value={idvValue}
              onValueChange={setIdvValue}
              minimumTrackTintColor={PRIMARY_COLOR}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={PRIMARY_COLOR}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>{formatShortCurrency(240000)}</Text>
              <Text style={styles.sliderLabel}>{formatShortCurrency(320000)}</Text>
            </View>
          </View>
        </View>

        {/* Quotes List */}
        {quotes.map((quote, index) => (
          <View key={quote.id} style={styles.quoteCard}>
            {/* Best Value Badge */}
            {index === 0 && (
              <View style={styles.bestValueBadge}>
                <Ionicons name="star" size={12} color="#FFF" />
                <Text style={styles.bestValueText}>Best Value</Text>
              </View>
            )}

            {/* Company Header */}
            <View style={styles.quoteHeader}>
              <View style={styles.companyInfo}>
                <View style={styles.logoContainer}>
                  <Ionicons name={quote.logo} size={28} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.companyDetails}>
                  <Text style={styles.companyName}>{quote.company}</Text>
                  <View style={styles.ratingRow}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={12} color="#fbbf24" />
                      <Text style={styles.ratingText}>{quote.rating}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.claimContainer}>
                      <Feather name="check-circle" size={12} color="#10b981" />
                      <Text style={styles.claimText}>{quote.claimSettlement} Claims</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.coveragePill}>
                <Text style={styles.coverageText}>{quote.coverage}</Text>
              </View>
            </View>

            {/* Premium and IDV Row */}
            <View style={styles.priceRow}>
              <View style={styles.priceBox}>
                <View style={styles.priceHeader}>
                  <Feather name="tag" size={14} color="#6b7280" />
                  <Text style={styles.priceLabel}>Premium</Text>
                </View>
                <Text style={styles.premiumAmount}>{formatCurrency(quote.premium)}</Text>
                <Text style={styles.perYear}>/year</Text>
              </View>
              
              <View style={styles.verticalDivider} />
              
              <View style={styles.priceBox}>
                <View style={styles.priceHeader}>
                  <MaterialCommunityIcons name="shield-check" size={14} color="#6b7280" />
                  <Text style={styles.priceLabel}>IDV</Text>
                </View>
                <Text style={styles.idvAmount}>{formatCurrency(quote.idv)}</Text>
                <Text style={styles.coverAmount}>Cover Amount</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View>
              <TouchableOpacity onPress={handleBuy} style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy Now</Text>
                <Feather name="arrow-right" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  quoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quoteCount: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  filterCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  policyChipContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  policyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  selectedPolicyChip: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  policyChipText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  selectedPolicyChipText: {
    color: '#FFF',
    fontWeight: '600',
  },
  sliderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  selectedIdvValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  sliderWrapper: {
    marginTop: 4,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sliderLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sortLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  quoteCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  bestValueBadge: {
    position: 'absolute',
    top: 0,
    right: 16,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bestValueText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR + '12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR + '20',
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
  },
  claimContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  claimText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  coveragePill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  coverageText: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 14,
  },
  priceBox: {
    flex: 1,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  perYear: {
    fontSize: 11,
    color: '#9ca3af',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  idvAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  coverAmount: {
    fontSize: 11,
    color: '#9ca3af',
  },
  featuresSection: {
    marginBottom: 14,
  },
  featuresTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  viewMoreText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  detailsButton: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFF',
    gap: 6,
  },
  detailsButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  buyButton: {
    flex: 0.65,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Quotations;