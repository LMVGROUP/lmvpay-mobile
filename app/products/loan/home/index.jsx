import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import axios from 'axios';


const { width, height } = Dimensions.get('window');

// Reusable Dropdown Component
const Dropdown = ({ 
  label, 
  value, 
  options = [], 
  placeholder = "Select an option",
  onSelect,
  required = false,
  icon
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.labelContainer}>
        {icon && (
          <View style={styles.labelIcon}>
            {icon}
          </View>
        )}
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.dropdownButton, value && styles.dropdownButtonSelected]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.dropdownContent}>
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <Ionicons 
            name={modalVisible ? "chevron-up" : "chevron-down"} 
            size={22} 
            color={value ? "#1a3d5c" : "#8a94a6"} 
          />
        </View>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="options" size={20} color="#1a3d5c" />
                <Text style={styles.modalTitle}>{label}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close-circle" size={24} color="#8a94a6" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    value === item && styles.modalItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.6}
                >
                  <View style={styles.modalItemContent}>
                    <View style={[
                      styles.modalItemIcon,
                      value === item && styles.modalItemIconSelected
                    ]}>
                      <Ionicons 
                        name="checkmark" 
                        size={16} 
                        color={value === item ? "#fff" : "transparent"} 
                      />
                    </View>
                    <Text style={[
                      styles.modalItemText,
                      value === item && styles.modalItemTextSelected,
                    ]}>
                      {item}
                    </Text>
                  </View>
                  {value === item && (
                    <Ionicons name="checkmark-circle" size={20} color="#1a3d5c" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Success Modal Component
const SuccessModal = ({ visible, onClose, loanAmount }) => {
  const scaleAnim = new Animated.Value(0.8);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <Animated.View style={[styles.successModalOverlay, { opacity: opacityAnim }]}>
        <Animated.View style={[
          styles.successModalContent,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          {/* Success Animation */}
          <View style={styles.animationContainer}>
            <LottieView
              source={require('../../../../assets/animations/FormSuccess.json')}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
          </View>

          <Text style={styles.successTitle}>Application Submitted!</Text>
          
          <Text style={styles.successSubtitle}>
            Your home loan application for ₹{loanAmount ? parseInt(loanAmount.replace(/,/g, '')).toLocaleString('en-IN') : '0'} has been successfully submitted.
          </Text>

          <View style={styles.successDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#10b981" />
              <Text style={styles.detailText}>Response within 24 hours</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="attach-email" size={20} color="#10b981" />
              <Text style={styles.detailText}>Check email for confirmation</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="phone" size={20} color="#10b981" />
              <Text style={styles.detailText}>Advisor will contact you soon</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.successButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10b981', '#34d399']}
              style={styles.successButtonGradient}
            >
              <Text style={styles.successButtonText}>Track Application</Text>
              <AntDesign name="right" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onClose}
          >
            <Text style={styles.secondaryButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Main Component
export default function HomeLoanDetails() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form fields
  const [formData, setFormData] = useState({
    loanAmount: '',
    city: '',
    propertyType: '',
    propertyCity: '',
    propertyValue: '',
    purchaseType: '',
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    consentGiven: false,
  });

  // Data arrays
  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ];

  const propertyTypes = [
    'Apartment',
    'Villa',
    'Plot',
    'Independent House',
    'Penthouse',
  ];

  const purchaseTypes = [
    'New Construction',
    'Resale Property',
    'Under-construction',
    'Plot Purchase',
  ];

  // Update form data
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '';
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    return num.toLocaleString('en-IN');
  };

  // Handle currency input
  const handleCurrencyChange = (key, value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    updateFormData(key, cleaned);
  };

  // Validation
  const isValid = () => {
    return (
      formData.loanAmount &&
      parseFloat(formData.loanAmount) > 0 &&
      formData.city &&
      formData.propertyType &&
      formData.propertyValue &&
      parseFloat(formData.propertyValue) > 0 &&
      formData.fullName.trim() &&
      formData.mobileNumber.length === 10 &&
      formData.emailAddress.includes('@') &&
      formData.consentGiven
    );
  };

const createAPIPayload = () => {
  return {
    loan_amount: parseInt(formData.loanAmount) || 0,
    city: formData.city,
    property_type: formData.propertyType,
    estimated_propery_value: parseInt(formData.propertyValue) || 0,
    customer_name: formData.fullName.trim(),
    mobile: formData.mobileNumber,
    email: formData.emailAddress.toLowerCase(),
    lead_type :  'LOAN',
    created_by_type : 'CUSTOMER',
    product_type : 'LOAN',
    product_sub_type : 'HOME LOAN',
    lead_source : 'MOBILE'
  };
};

// Then in handleSubmit:
const handleSubmit = async () => {
  if (isValid()) {
    const payload = createAPIPayload();
    
    console.log("API Payload:", payload);
    
    try {
      setIsSubmitting(true);
      console.log(payload,"payload")
      // Send the payload directly, not wrapped in another object
      const response = await axios.post(
        "https://oglonbssd2.execute-api.ap-south-1.amazonaws.com/prod/leads",
        payload
      );
      
      console.log("API Response:", response.data);
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error details:", error.response?.data);
      setIsSubmitting(false);
      
      // Show error to user
      alert("Submission failed. Please try again.");
    }
  }
};

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push('/products');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1a3d5c', '#2c5282']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Home Loan Application</Text>
          <Text style={styles.headerSubtitle}>Fill in your details</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="real-estate-agent" size={28} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        

        <View style={styles.content}>
          
          {/* Loan Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="monetization-on" size={24} color="#1a3d5c" />
              <Text style={styles.sectionTitle}>Loan Information</Text>
            </View>
            
            {/* Loan Amount */}
            <View style={styles.field}>
              <View style={styles.labelContainer}>
                <FontAwesome5 name="money-check-alt" size={16} color="#1a3d5c" />
                <Text style={styles.label}>
                  Loan Amount Required <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.input}
                  value={formatCurrency(formData.loanAmount)}
                  onChangeText={(value) => handleCurrencyChange('loanAmount', value)}
                  placeholder="Enter loan amount"
                  placeholderTextColor="#8a94a6"
                  keyboardType="numeric"
                />
                {formData.loanAmount && (
                  <View style={styles.inputTag}>
                    <Text style={styles.inputTagText}>
                      ≈ ₹{formData.loanAmount ? (parseInt(formData.loanAmount) / 83).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'} per month
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* City Dropdown */}
            <Dropdown
              label="City"
              value={formData.city}
              options={cities}
              placeholder="Select your city"
              onSelect={(value) => updateFormData('city', value)}
              required
              icon={<Ionicons name="location" size={16} color="#1a3d5c" />}
            />

            {/* Property Type Dropdown */}
            <Dropdown
              label="Property Type"
              value={formData.propertyType}
              options={propertyTypes}
              placeholder="Select property type"
              onSelect={(value) => updateFormData('propertyType', value)}
              required
              icon={<Ionicons name="business" size={16} color="#1a3d5c" />}
            />

            {/* Property City */}
            {/* <View style={styles.field}>
              <View style={styles.labelContainer}>
                <Ionicons name="home" size={16} color="#1a3d5c" />
                <Text style={styles.label}>
                  Property City <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#8a94a6" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={formData.propertyCity}
                  onChangeText={(value) => updateFormData('propertyCity', value)}
                  placeholder="Enter property city"
                  placeholderTextColor="#8a94a6"
                />
              </View>
            </View> */}

            {/* Property Value */}
            <View style={styles.field}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="price-change" size={16} color="#1a3d5c" />
                <Text style={styles.label}>
                  Estimated Property Value <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.input}
                  value={formatCurrency(formData.propertyValue)}
                  onChangeText={(value) => handleCurrencyChange('propertyValue', value)}
                  placeholder="Enter property value"
                  placeholderTextColor="#8a94a6"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Purchase Type Dropdown */}
            {/* <Dropdown
              label="Purchase Type"
              value={formData.purchaseType}
              options={purchaseTypes}
              placeholder="Select purchase type"
              onSelect={(value) => updateFormData('purchaseType', value)}
              required
              icon={<MaterialIcons name="shopping-cart" size={16} color="#1a3d5c" />}
            /> */}
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={24} color="#1a3d5c" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            {/* Full Name */}
            <View style={styles.field}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={16} color="#1a3d5c" />
                <Text style={styles.label}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="person-circle-outline" size={20} color="#8a94a6" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8a94a6"
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.field}>
              <View style={styles.labelContainer}>
                <Ionicons name="call" size={16} color="#1a3d5c" />
                <Text style={styles.label}>
                  Mobile Number <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, styles.inputWithCountryCode]}
                  value={formData.mobileNumber}
                  onChangeText={(value) => updateFormData('mobileNumber', value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor="#8a94a6"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.field}>
              <View style={styles.labelContainer}>
                <Ionicons name="mail" size={16} color="#1a3d5c" />
                <Text style={styles.label}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8a94a6" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={formData.emailAddress}
                  onChangeText={(value) => updateFormData('emailAddress', value)}
                  placeholder="Enter email address"
                  placeholderTextColor="#8a94a6"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Consent Section */}
          <View style={styles.consentContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => updateFormData('consentGiven', !formData.consentGiven)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, formData.consentGiven && styles.checkboxChecked]}>
                {formData.consentGiven && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxLabel}>
                  I agree to be contacted by an LMV ONE advisor regarding my loan request
                </Text>
                <Text style={styles.checkboxSubtext}>
                  By checking this box, you consent to receive communications
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="shield-checkmark" size={24} color="#1a3d5c" />
            <View style={styles.infoBannerContent}>
              <Text style={styles.infoBannerTitle}>Your Data is Secure</Text>
              <Text style={styles.infoBannerText}>
                We use bank-level encryption to protect your personal information
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !isValid() && styles.continueButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid() || isSubmitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isValid() ? ['#1a3d5c', '#2c5282'] : ['#c7c7cc', '#a0a0a0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {isSubmitting ? (
              <View style={styles.submittingContainer}>
                <Ionicons name="sync-outline" size={24} color="#fff" style={styles.spinningIcon} />
                <Text style={styles.continueButtonText}>Submitting...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.continueButtonText}>
                  Submit Application
                </Text>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        onClose={handleCloseSuccess}
        loanAmount={formData.loanAmount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  headerIcon: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressStepActive: {
    opacity: 1,
  },
  progressStepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a3d5c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  progressStepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  progressStepLabel: {
    fontSize: 12,
    color: '#1a3d5c',
    fontWeight: '500',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
    marginBottom: 18,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  previewBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 61, 92, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(26, 61, 92, 0.2)',
  },
  previewBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a3d5c',
    marginBottom: 2,
  },
  previewSubtitle: {
    fontSize: 13,
    color: '#475569',
  },
  previewButton: {
    backgroundColor: 'rgba(26, 61, 92, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  previewButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a3d5c',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3d5c',
    marginLeft: 10,
  },
  field: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  required: {
    color: '#ef4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    position: 'relative',
  },
  currencySymbol: {
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a3d5c',
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  countryCode: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a3d5c',
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  inputWithIcon: {
    paddingLeft: 12,
  },
  inputWithCountryCode: {
    paddingLeft: 12,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  inputTag: {
    position: 'absolute',
    right: 8,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  inputTagText: {
    fontSize: 11,
    color: '#0369a1',
    fontWeight: '500',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  dropdownButtonSelected: {
    borderColor: '#1a3d5c',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: '#8a94a6',
    fontWeight: '400',
  },
  labelIcon: {
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3d5c',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  modalItemSelected: {
    backgroundColor: '#f1f5f9',
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalItemIconSelected: {
    backgroundColor: '#1a3d5c',
    borderColor: '#1a3d5c',
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    color: '#475569',
  },
  modalItemTextSelected: {
    color: '#1a3d5c',
    fontWeight: '600',
  },
  consentContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: '#1a3d5c',
    backgroundColor: '#1a3d5c',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 4,
  },
  checkboxSubtext: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 61, 92, 0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a3d5c',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spinningIcon: {
    animation: {
      to: { rotate: '360deg' },
      duration: 1000,
      easing: Easing.linear,
      loop: true,
    },
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  animationContainer: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a3d5c',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  successDetails: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  successButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  successButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  successButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
});