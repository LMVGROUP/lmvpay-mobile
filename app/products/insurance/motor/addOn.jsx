import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

const PRIMARY_COLOR = "#103d69";
const CURRENCY_SYMBOL = "₹";

// Colorful icon backgrounds
const ICON_COLORS = {
  zeroDep: '#E3F2FD', // Light Blue
  roadside: '#FFF3E0', // Light Orange
  engine: '#FFEBEE', // Light Red
  concern: '#E8F5E8', // Light Green
  ownerDriver: '#F3E5F5', // Light Purple
  paidDriver: '#E1F5FE', // Light Sky
  passenger1: '#FFF8E1', // Light Amber
  passenger2: '#E0F7FA', // Light Cyan
  biFuel: '#F9FBE7', // Light Lime
};

const AddOns = ({ navigation }) => {
  const [selectedAddons, setSelectedAddons] = useState({
    zeroDep: false,
    roadsideAssistance: false,
    engineProtection: false,
    concernshlac: false,
    ownerDriverPA: false,
    paidDriver: false,
    passengerCover1Lac: false,
    passengerCover2Lac: false,
    biFuelKit: false,
  });

  const [passengerCoverType, setPassengerCoverType] = useState(null); // '1lac' or '2lac'

  const toggleAddon = (addonKey) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonKey]: !prev[addonKey]
    }));
  };

  const handlePassengerCover = (type) => {
    if (passengerCoverType === type) {
      setPassengerCoverType(null);
      setSelectedAddons(prev => ({
        ...prev,
        passengerCover1Lac: false,
        passengerCover2Lac: false
      }));
    } else {
      setPassengerCoverType(type);
      setSelectedAddons(prev => ({
        ...prev,
        passengerCover1Lac: type === '1lac',
        passengerCover2Lac: type === '2lac'
      }));
    }
  };

  const calculateTotalPremium = () => {
    let total = 12499; // Base premium
    
    if (selectedAddons.zeroDep) total += 2499;
    if (selectedAddons.roadsideAssistance) total += 2499;
    if (selectedAddons.engineProtection) total += 1299;
    if (selectedAddons.concernshlac) total += 6000;
    if (selectedAddons.ownerDriverPA) total += 750;
    if (selectedAddons.paidDriver) total += 500;
    if (selectedAddons.passengerCover1Lac) total += 100;
    if (selectedAddons.passengerCover2Lac) total += 180;
    if (selectedAddons.biFuelKit) total += 850;
    
    return total;
  };

  const formatCurrency = (value) => {
    return `${CURRENCY_SYMBOL}${value.toLocaleString('en-IN')}`;
  };

  const getAddonIcon = (addonKey, isSelected) => {
    const iconProps = {
      size: 20,
      color: isSelected ? PRIMARY_COLOR : '#666',
    };

    switch(addonKey) {
      case 'zeroDep':
        return <MaterialCommunityIcons name="shield-off" {...iconProps} />;
      case 'roadsideAssistance':
        return <MaterialCommunityIcons name="tow-truck" {...iconProps} />;
      case 'engineProtection':
        return <FontAwesome5 name="oil-can" {...iconProps} />;
      case 'concernshlac':
        return <MaterialCommunityIcons name="shield-star" {...iconProps} />;
      case 'ownerDriverPA':
        return <FontAwesome5 name="user-shield" {...iconProps} />;
      case 'paidDriver':
        return <MaterialCommunityIcons name="account-tie" {...iconProps} />;
      case 'passengerCover1Lac':
      case 'passengerCover2Lac':
        return <MaterialCommunityIcons name="account-group" {...iconProps} />;
      case 'biFuelKit':
        return <MaterialCommunityIcons name="fuel" {...iconProps} />;
      default:
        return <MaterialCommunityIcons name="shield" {...iconProps} />;
    }
  };

  const getIconBackground = (addonKey, isSelected) => {
    const backgrounds = {
      zeroDep: ICON_COLORS.zeroDep,
      roadsideAssistance: ICON_COLORS.roadside,
      engineProtection: ICON_COLORS.engine,
      concernshlac: ICON_COLORS.concern,
      ownerDriverPA: ICON_COLORS.ownerDriver,
      paidDriver: ICON_COLORS.paidDriver,
      passengerCover1Lac: ICON_COLORS.passenger1,
      passengerCover2Lac: ICON_COLORS.passenger2,
      biFuelKit: ICON_COLORS.biFuel,
    };
    
    // When selected, make the background slightly darker/more vibrant
    if (isSelected) {
      const selectedBackgrounds = {
        zeroDep: '#BBDEFB', // Darker Blue
        roadsideAssistance: '#FFE0B2', // Darker Orange
        engineProtection: '#FFCDD2', // Darker Red
        concernshlac: '#C8E6C9', // Darker Green
        ownerDriverPA: '#E1BEE7', // Darker Purple
        paidDriver: '#B3E5FC', // Darker Sky
        passengerCover1Lac: '#FFECB3', // Darker Amber
        passengerCover2Lac: '#B2EBF2', // Darker Cyan
        biFuelKit: '#F0F4C3', // Darker Lime
      };
      return selectedBackgrounds[addonKey] || backgrounds[addonKey];
    }
    
    return backgrounds[addonKey] || '#F5F5F5';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Your Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Product Details Card */}
        <View style={styles.productCard}>
          {/* Header with gradient effect */}
          <View style={styles.productHeader}>
            <View style={[styles.logoContainer, { backgroundColor: '#E8F0FE' }]}>
              <MaterialCommunityIcons name="shield-car" size={36} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.productTitleContainer}>
              <Text style={styles.companyName}>HDFC ERGO</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Ionicons name="star-half" size={14} color="#FFB800" />
                </View>
                <Text style={styles.ratingText}>4.5 (2.3k reviews)</Text>
              </View>
            </View>
            <View style={styles.claimRatioBadge}>
              <Text style={styles.claimRatioText}>98% Claim Ratio</Text>
            </View>
          </View>

          {/* Premium and IDV in a more visual layout */}
          <View style={styles.premiumRow}>
            <View style={styles.premiumBox}>
              <Text style={styles.premiumLabel}>Base Premium</Text>
              <Text style={styles.premiumAmount}>{formatCurrency(12499)}</Text>
              <Text style={styles.premiumPeriod}>per year</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.idvBox}>
              <View style={styles.idvHeader}>
                <MaterialCommunityIcons name="currency-inr" size={16} color={PRIMARY_COLOR} />
                <Text style={styles.idvLabel}>IDV</Text>
              </View>
              <Text style={styles.idvValue}>{formatCurrency(287493)}</Text>
              <Text style={styles.idvNote}>Insured Declared Value</Text>
            </View>
          </View>

          {/* Key benefits chip */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitChip}>
              <Ionicons name="flash" size={14} color="#FFB800" />
              <Text style={styles.benefitText}>Zero Dep available</Text>
            </View>
            <View style={styles.benefitChip}>
              <Ionicons name="car" size={14} color="#4CAF50" />
              <Text style={styles.benefitText}>NCB Protection</Text>
            </View>
            <View style={styles.benefitChip}>
              <Ionicons name="shield" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.benefitText}>Cashless Garages</Text>
            </View>
          </View>
        </View>

        {/* Choose Add-Ons Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialCommunityIcons name="package-variant" size={20} color="#FFF" />
            </View>
            <Text style={styles.sectionTitle}>Choose Add-Ons</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Enhance your coverage with additional protection</Text>

          {/* Zero Depreciation */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.zeroDep && styles.selectedAddon]}
            onPress={() => toggleAddon('zeroDep')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('zeroDep', selectedAddons.zeroDep) }]}>
                {getAddonIcon('zeroDep', selectedAddons.zeroDep)}
                {selectedAddons.zeroDep && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.zeroDep && styles.selectedAddonTitle]}>Zero Depreciation</Text>
                <Text style={styles.addonDesc}>Full claim without depreciation</Text>
              </View>
            </View>
            <View style={styles.addonRight}>
              <Text style={[styles.addonPrice, selectedAddons.zeroDep && styles.selectedAddonPrice]}>+{formatCurrency(2499)}</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 24x7 Roadside Assistance */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.roadsideAssistance && styles.selectedAddon]}
            onPress={() => toggleAddon('roadsideAssistance')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('roadsideAssistance', selectedAddons.roadsideAssistance) }]}>
                {getAddonIcon('roadsideAssistance', selectedAddons.roadsideAssistance)}
                {selectedAddons.roadsideAssistance && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.roadsideAssistance && styles.selectedAddonTitle]}>24x7 Roadside Assistance</Text>
                <Text style={styles.addonDesc}>Towing, flat tire, fuel delivery</Text>
              </View>
            </View>
            <Text style={[styles.addonPrice, selectedAddons.roadsideAssistance && styles.selectedAddonPrice]}>+{formatCurrency(2499)}</Text>
          </TouchableOpacity>

          {/* Engine Protection Cover */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.engineProtection && styles.selectedAddon]}
            onPress={() => toggleAddon('engineProtection')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('engineProtection', selectedAddons.engineProtection) }]}>
                {getAddonIcon('engineProtection', selectedAddons.engineProtection)}
                {selectedAddons.engineProtection && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.engineProtection && styles.selectedAddonTitle]}>Engine Protection Cover</Text>
                <Text style={styles.addonDesc}>Covers engine & gearbox</Text>
              </View>
            </View>
            <Text style={[styles.addonPrice, selectedAddons.engineProtection && styles.selectedAddonPrice]}>+{formatCurrency(1299)}</Text>
          </TouchableOpacity>

          {/* Concernshlac */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.concernshlac && styles.selectedAddon]}
            onPress={() => toggleAddon('concernshlac')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('concernshlac', selectedAddons.concernshlac) }]}>
                {getAddonIcon('concernshlac', selectedAddons.concernshlac)}
                {selectedAddons.concernshlac && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.concernshlac && styles.selectedAddonTitle]}>Concernshlac</Text>
                <Text style={styles.addonDesc}>Special comprehensive cover</Text>
              </View>
            </View>
            <Text style={[styles.addonPrice, selectedAddons.concernshlac && styles.selectedAddonPrice]}>+{formatCurrency(6000)}</Text>
          </TouchableOpacity>
        </View>

        {/* Accident Covers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#FF9800' }]}>
              <MaterialCommunityIcons name="car-emergency" size={20} color="#FFF" />
            </View>
            <Text style={styles.sectionTitle}>Accident Covers</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Protection for you and your passengers</Text>

          {/* Owner-Driver PA Cover */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.ownerDriverPA && styles.selectedAddon]}
            onPress={() => toggleAddon('ownerDriverPA')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('ownerDriverPA', selectedAddons.ownerDriverPA) }]}>
                {getAddonIcon('ownerDriverPA', selectedAddons.ownerDriverPA)}
                {selectedAddons.ownerDriverPA && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.ownerDriverPA && styles.selectedAddonTitle]}>Owner-Driver PA Cover</Text>
                <Text style={styles.addonDesc}>Personal accident cover</Text>
              </View>
            </View>
            <Text style={[styles.addonPrice, selectedAddons.ownerDriverPA && styles.selectedAddonPrice]}>+{formatCurrency(750)}</Text>
          </TouchableOpacity>

          {/* Paid Driver Cover */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.paidDriver && styles.selectedAddon]}
            onPress={() => toggleAddon('paidDriver')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('paidDriver', selectedAddons.paidDriver) }]}>
                {getAddonIcon('paidDriver', selectedAddons.paidDriver)}
                {selectedAddons.paidDriver && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.paidDriver && styles.selectedAddonTitle]}>Paid Driver Cover</Text>
                <Text style={styles.addonDesc}>Cover for your hired driver</Text>
              </View>
            </View>
            <Text style={[styles.addonPrice, selectedAddons.paidDriver && styles.selectedAddonPrice]}>+{formatCurrency(500)}</Text>
          </TouchableOpacity>

          {/* Passenger Cover Options */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.passengerCover1Lac && styles.selectedAddon]}
            onPress={() => handlePassengerCover('1lac')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('passengerCover1Lac', selectedAddons.passengerCover1Lac) }]}>
                {getAddonIcon('passengerCover1Lac', selectedAddons.passengerCover1Lac)}
                {selectedAddons.passengerCover1Lac && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.passengerCover1Lac && styles.selectedAddonTitle]}>₹1 Lac Unnamed Passenger Cover</Text>
                <Text style={styles.addonDesc}>Covers up to 4 passengers</Text>
              </View>
            </View>
            <View style={styles.radioContainer}>
              <View style={[styles.radio, passengerCoverType === '1lac' && styles.radioSelected]}>
                {passengerCoverType === '1lac' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.addonPrice, selectedAddons.passengerCover1Lac && styles.selectedAddonPrice]}>+{formatCurrency(100)}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.passengerCover2Lac && styles.selectedAddon]}
            onPress={() => handlePassengerCover('2lac')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('passengerCover2Lac', selectedAddons.passengerCover2Lac) }]}>
                {getAddonIcon('passengerCover2Lac', selectedAddons.passengerCover2Lac)}
                {selectedAddons.passengerCover2Lac && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.passengerCover2Lac && styles.selectedAddonTitle]}>₹2 Lac Unnamed Passenger Cover</Text>
                <Text style={styles.addonDesc}>Higher coverage for passengers</Text>
              </View>
            </View>
            <View style={styles.radioContainer}>
              <View style={[styles.radio, passengerCoverType === '2lac' && styles.radioSelected]}>
                {passengerCoverType === '2lac' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.addonPrice, selectedAddons.passengerCover2Lac && styles.selectedAddonPrice]}>+{formatCurrency(180)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Accessories Cover Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#9C27B0' }]}>
              <MaterialCommunityIcons name="car-wrench" size={20} color="#FFF" />
            </View>
            <Text style={styles.sectionTitle}>Accessories Cover</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Protect your vehicle's accessories</Text>

          {/* Bi-Fuel Kit Cover */}
          <TouchableOpacity 
            style={[styles.addonCard, selectedAddons.biFuelKit && styles.selectedAddon]}
            onPress={() => toggleAddon('biFuelKit')}
          >
            <View style={styles.addonLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getIconBackground('biFuelKit', selectedAddons.biFuelKit) }]}>
                {getAddonIcon('biFuelKit', selectedAddons.biFuelKit)}
                {selectedAddons.biFuelKit && (
                  <View style={styles.selectedIconOverlay}>
                    <Ionicons name="checkmark-circle" size={18} color={PRIMARY_COLOR} />
                  </View>
                )}
              </View>
              <View style={styles.addonInfo}>
                <Text style={[styles.addonTitle, selectedAddons.biFuelKit && styles.selectedAddonTitle]}>Bi-Fuel Kit Cover</Text>
                <Text style={styles.addonDesc}>Cover for CNG/LPG kit</Text>
              </View>
            </View>
            <Text style={[styles.addonPrice, selectedAddons.biFuelKit && styles.selectedAddonPrice]}>+{formatCurrency(850)}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Footer with Total Premium */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Updated Premium</Text>
          <Text style={styles.totalAmount}>{formatCurrency(calculateTotalPremium())}</Text>
          <Text style={styles.totalNote}>Including taxes</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitleContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  claimRatioBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  claimRatioText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  premiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  premiumBox: {
    flex: 1,
    alignItems: 'center',
  },
  premiumLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  premiumAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  premiumPeriod: {
    fontSize: 11,
    color: '#999',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  idvBox: {
    flex: 1,
    alignItems: 'center',
  },
  idvHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  idvLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  idvValue: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  idvNote: {
    fontSize: 10,
    color: '#999',
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  benefitText: {
    fontSize: 11,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
    marginLeft: 46,
  },
  addonCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAddon: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    backgroundColor: '#FFF', // Keep background white, just highlight border
  },
  addonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedIconOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addonInfo: {
    flex: 1,
  },
  addonTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  selectedAddonTitle: {
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  addonDesc: {
    fontSize: 11,
    color: '#999',
  },
  addonRight: {
    alignItems: 'flex-end',
  },
  addonPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  selectedAddonPrice: {
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  recommendedBadge: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  recommendedText: {
    fontSize: 8,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  radioContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: PRIMARY_COLOR,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  totalNote: {
    fontSize: 10,
    color: '#999',
  },
  proceedButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddOns;