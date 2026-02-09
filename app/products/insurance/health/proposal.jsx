import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import Dropdown from '../../../../components/DropDown';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.0.208:8000';
const ProposalForm = () => {
   const router = useRouter();
  const params = useLocalSearchParams();
  const paramsData = params.planData;
  const paramData = JSON.parse(paramsData);
  const [activeTab, setActiveTab] = useState('proposer');
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const scrollViewRef = useRef(null);

  // Title options for dropdown
  const titleOptions = ['MR', 'MS', 'MRS', 'DR', 'PROF'];
  const genderOptions = ['Male', 'Female', 'Others'];
  const maritalStatusOptions = ['Married', 'Unmarried', 'Divorced', 'Widowed'];
  const relationshipOptions = ['Self', 'Son', 'Daughter', 'Father', 'Mother', 'Spouse', 'Brother', 'Sister'];

  // Proposer Details State
  const [proposer, setProposer] = useState({
    title: '',
    firstName: '',
    lastName: '',
    dob: new Date(),
    maritalStatus: '',
    gender: '',
    pincode: '',
    address1: '',
    address2: '',
    email: '',
    mobile: '',
    pan: '',
  });
  
  // Validation errors for proposer
  const [proposerErrors, setProposerErrors] = useState({});

  // Nominee Details State
  const [nominee, setNominee] = useState({
    fullName: '',
    dob: new Date(),
    relationship: '',
  });
  console.log(paramData?.name,"checking")
useEffect(() => {
  try {
    if (paramsData) {
      const parsedPlanData = JSON.parse(paramsData);
      console.log('Parsed plan data:', parsedPlanData?.apiData);
      
      // You can use this data to display in your header or anywhere in the form
      // For example:
      // setPlanDetails(parsedPlanData);
    }
  } catch (error) {
    console.error('Error parsing plan data:', error);
  }
}, [paramsData]);
  
  // Validation errors for nominee
  const [nomineeErrors, setNomineeErrors] = useState({});
const HeaderWithPlanDetails = () => {
  let planDetails = null;
  
  try {
    if (paramsData) {
      planDetails = JSON.parse(paramsData);
    }
  } catch (error) {
    console.error('Error parsing plan data in header:', error);
  }
  
  if (!planDetails) {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Insurance Proposal</Text>
          <Text style={styles.headerSubtitle}>
            Step {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
          </Text>
        </View>
      </View>
    );
  }

  // Calculate premium in rupees (since it's stored in paise)
  const finalPremiumRupees = planDetails.finalPremium / 100;
  const coverageInLakhs = planDetails.coverage_amount / 100000;

  return (
    <View style={styles.headerWithPlan}>
      {/* Plan Details Section */}
      <View style={styles.planDetailsContainer}>
        <View style={styles.planRow}>
          <View style={styles.planLogoContainer}>
            {/* You can add logo here if available */}
            <Text style={styles.planProvider}>{planDetails.company_name}</Text>
          </View>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{planDetails.name}</Text>
          </View>
        </View>
        
        <View style={styles.planDetailsRow}>
          <View style={styles.planDetailItem}>
            <Text style={styles.planDetailLabel}>Sum Insured</Text>
            <Text style={styles.planDetailValue}>₹{coverageInLakhs} Lakhs</Text>
          </View>
          <View style={styles.planDetailItem}>
            <Text style={styles.planDetailLabel}>Term</Text>
            <Text style={styles.planDetailValue}>{planDetails.term} Year</Text>
          </View>
          <View style={styles.planDetailItem}>
            <Text style={styles.planDetailLabel}>Premium</Text>
            <Text style={styles.planPremiumValue}>
              ₹{finalPremiumRupees.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <Text style={styles.headerTitle}>Proposal Form</Text>
        <Text style={styles.headerSubtitle}>
          Step {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
        </Text>
      </View>
    </View>
  );
};
  // Member Details State
  const [members, setMembers] = useState([
    {
      title: '',
      firstName: '',
      lastName: '',
      dob: new Date(),
      maritalStatus: '',
      relationship: 'Self',
      height: '',
      weight: '',
    }
  ]);
  
  // Validation errors for members
  const [memberErrors, setMemberErrors] = useState([{}]);

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    nameAsPerBankAccount: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
  });
  
  // Validation errors for bank
  const [bankErrors, setBankErrors] = useState({});

  // Date picker states
  const [showProposerDatePicker, setShowProposerDatePicker] = useState(false);
  const [showNomineeDatePicker, setShowNomineeDatePicker] = useState(false);
  const [showMemberDatePicker, setShowMemberDatePicker] = useState(null);

  // Track completed tabs
  const [completedTabs, setCompletedTabs] = useState([]);

  // Tabs configuration
  const tabs = [
    { 
      id: 'proposer', 
      label: 'Proposer', 
      icon: 'person-outline',
      activeIcon: 'person',
    },
    { 
      id: 'nominee', 
      label: 'Nominee', 
      icon: 'person-add-outline',
      activeIcon: 'person-add',
    },
    { 
      id: 'member', 
      label: 'Members', 
      icon: 'people-outline',
      activeIcon: 'people',
    },
    { 
      id: 'medical', 
      label: 'Medical', 
      icon: 'medical-outline',
      activeIcon: 'medical',
    },
    { 
      id: 'bank', 
      label: 'Bank', 
      icon: 'card-outline',
      activeIcon: 'card',
    },
  ];

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePAN = (pan) => {
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return re.test(pan);
  };

  const validateMobile = (mobile) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
  };

  const validatePincode = (pincode) => {
    const re = /^\d{6}$/;
    return re.test(pincode);
  };

  const validateIFSC = (ifsc) => {
    const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return re.test(ifsc);
  };

  const validateAccountNumber = (account) => {
    const re = /^\d{9,18}$/;
    return re.test(account);
  };

  // Proposer validation
  const validateProposer = () => {
    const errors = {};
    
    if (!proposer.title.trim()) errors.title = 'Title is required';
    if (!proposer.firstName.trim()) errors.firstName = 'First name is required';
    if (!proposer.lastName.trim()) errors.lastName = 'Last name is required';
    
    const age = new Date().getFullYear() - proposer.dob.getFullYear();
    if (age < 18) errors.dob = 'Must be 18 years or older';
    if (age > 100) errors.dob = 'Invalid date of birth';
    
    if (!proposer.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!proposer.gender) errors.gender = 'Gender is required';
    
    if (!validatePincode(proposer.pincode)) errors.pincode = 'Invalid pincode';
    if (!proposer.address1.trim()) errors.address1 = 'Address is required';
    
    if (!validateEmail(proposer.email)) errors.email = 'Invalid email address';
    if (!validateMobile(proposer.mobile)) errors.mobile = 'Invalid mobile number';
    if (!validatePAN(proposer.pan)) errors.pan = 'Invalid PAN number';
    
    setProposerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Nominee validation
  const validateNominee = () => {
    const errors = {};
    
    if (!nominee.fullName.trim()) errors.fullName = 'Nominee name is required';
    
    const age = new Date().getFullYear() - nominee.dob.getFullYear();
    if (age > 100) errors.dob = 'Invalid date of birth';
    
    if (!nominee.relationship) errors.relationship = 'Relationship is required';
    
    setNomineeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Member validation
  const validateMembers = () => {
    const errors = [];
    let isValid = true;
    
    members.forEach((member, index) => {
      const memberErrors = {};
      
      if (!member.title.trim()) {
        memberErrors.title = 'Title is required';
        isValid = false;
      }
      if (!member.firstName.trim()) {
        memberErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!member.lastName.trim()) {
        memberErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      const age = new Date().getFullYear() - member.dob.getFullYear();
      if (age > 100) {
        memberErrors.dob = 'Invalid date of birth';
        isValid = false;
      }
      
      if (!member.relationship) {
        memberErrors.relationship = 'Relationship is required';
        isValid = false;
      }
      
      if (!member.height) {
        memberErrors.height = 'Height is required';
        isValid = false;
      } else if (isNaN(member.height) || member.height < 50 || member.height > 250) {
        memberErrors.height = 'Invalid height (50-250 cm)';
        isValid = false;
      }
      
      if (!member.weight) {
        memberErrors.weight = 'Weight is required';
        isValid = false;
      } else if (isNaN(member.weight) || member.weight < 10 || member.weight > 200) {
        memberErrors.weight = 'Invalid weight (10-200 kg)';
        isValid = false;
      }
      
      errors[index] = memberErrors;
    });
    
    setMemberErrors(errors);
    return isValid;
  };

  // Bank validation
  const validateBank = () => {
    const errors = {};
    
    if (!bankDetails.nameAsPerBankAccount.trim()) errors.nameAsPerBankAccount = 'Account holder name is required';
    if (!bankDetails.bankName.trim()) errors.bankName = 'Bank name is required';
    
    if (!validateAccountNumber(bankDetails.accountNumber)) errors.accountNumber = 'Invalid account number';
    if (!validateIFSC(bankDetails.ifscCode)) errors.ifscCode = 'Invalid IFSC code';
    
    setBankErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if current tab is valid
  const validateCurrentTab = () => {
    switch (activeTab) {
      case 'proposer':
        return validateProposer();
      case 'nominee':
        return validateNominee();
      case 'member':
        return validateMembers();
      case 'bank':
        return validateBank();
      case 'medical':
        return true;
      default:
        return false;
    }
  };

  // Update completed tabs
  useEffect(() => {
    const isValid = validateCurrentTab();
    setIsContinueEnabled(isValid);
    
    // Mark tab as completed if valid
    if (isValid && !completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }
  }, [activeTab, proposer, nominee, members, bankDetails]);

  // Update proposer details
  const updateProposer = (field, value) => {
    setProposer({ ...proposer, [field]: value });
    if (proposerErrors[field]) {
      setProposerErrors({ ...proposerErrors, [field]: '' });
    }
  };

  // Update nominee details
  const updateNominee = (field, value) => {
    setNominee({ ...nominee, [field]: value });
    if (nomineeErrors[field]) {
      setNomineeErrors({ ...nomineeErrors, [field]: '' });
    }
  };

  // Update member details
  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
    
    if (memberErrors[index]?.[field]) {
      const updatedErrors = [...memberErrors];
      updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
      setMemberErrors(updatedErrors);
    }
  };

  // Update bank details
  const updateBankDetails = (field, value) => {
    setBankDetails({ ...bankDetails, [field]: value });
    if (bankErrors[field]) {
      setBankErrors({ ...bankErrors, [field]: '' });
    }
  };

  // Add new member
  const addMember = () => {
    setMembers([
      ...members,
      {
        title: '',
        firstName: '',
        lastName: '',
        dob: new Date(),
        maritalStatus: '',
        relationship: '',
        height: '',
        weight: '',
      }
    ]);
    setMemberErrors([...memberErrors, {}]);
  };

  // Remove member
  const removeMember = (index) => {
    if (members.length > 1) {
      const updatedMembers = members.filter((_, i) => i !== index);
      const updatedErrors = memberErrors.filter((_, i) => i !== index);
      setMembers(updatedMembers);
      setMemberErrors(updatedErrors);
    }
  };

  // Date change handlers
  const onProposerDateChange = (event, selectedDate) => {
    setShowProposerDatePicker(false);
    if (selectedDate) updateProposer('dob', selectedDate);
  };

  const onNomineeDateChange = (event, selectedDate) => {
    setShowNomineeDatePicker(false);
    if (selectedDate) updateNominee('dob', selectedDate);
  };

  const onMemberDateChange = (index, event, selectedDate) => {
    setShowMemberDatePicker(null);
    if (selectedDate) updateMember(index, 'dob', selectedDate);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Navigate to next tab
  const handleContinue = async () => {
    if (!validateCurrentTab()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }
    
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      setActiveTab(nextTab.id);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } else {
      const payload = {
      additionalInfo: {
        abhaNumber: "",
        hardcopyRequested: "N",
        accountholder: bankDetails.nameAsPerBankAccount,
        bankname: bankDetails.bankName,
        AccountNumber: bankDetails.accountNumber,
        ifsccode: bankDetails.ifscCode,
        agentId: 1000,
        any_previous_medical_condition: "No"
      },
      channel: "CUSTOMER",
      ckycNum: "",
      empId: null,
      membersData: {
        self: {
            title: "MR",
            firstName: "satya",
            lastName: "boda",
            dob: "01/01/2000",
            maritalStatus: "unmarried",
            gender: "male",
            height: "170",
            weight: "79",
            relationship: "self"
        }
    },
      nomineeData: {
        nomineeName: nominee.fullName,
        nomineeDob: nominee.dob,
        relation: nominee.relationship,
        title: "",
        nomineeAdress1: "",
        nomineeAdress2: "",
        appointeeName: "",
        appointeeDob: ""
      },
      premiumPostBody: {
        ChildrenAges:  [],
        adultsAges: paramData?.userPayload?.adultAges || [],
        familyAges: paramData?.userPayload?.familyAges || [],
        firstname: proposer.firstName,
        lastname: proposer.lastName,
        highestElderAge: paramData.userPayload.highestElderAge || "30",
        any_previous_medical_condition: "No",
        city: "Adilabad",
        noOfChildren: paramData.userPayload.noOfChildren || "0",
        noOfParents:  paramData.userPayload.noOfParents || "0",
        noOfPeople:  paramData.userPayload.noOfPeople || "1",
        number: proposer.mobile,
        pincode: proposer.pincode,
        policyType: "Individual",
        provider: paramData.company_name,
        selectedCoverage: paramData.apiData.sumInsured,
        state: "Telangana",
        // field_AHC: getAddonFieldValue('Annual Health Check-up'),
        // field_OPD: getAddonFieldValue('Care OPD'),
        // field_WB: getAddonFieldValue('Wellness Benefit'),
        // field_IC: getAddonFieldValue('Instant Cover'),
        // field_CS: getAddonFieldValue('Claim Shield'),
        // field_NCB: getAddonFieldValue('Bonus Benefits') || getAddonFieldValue('NCB Super'),
        // field_BFB: getAddonFieldValue('Be-Fit Benefit'),
        // field_CSP: getAddonFieldValue('Claim Shield Plus'),
        // field_UEC: getAddonFieldValue('Unlimited E Consultation'),
        // field_PPH: getAddonFieldValue('Pre Post Hospitalization'),
        // field_SS: getAddonFieldValue('Smart Select'),
        tenure:paramData.apiData.term.replace(" year", "").replace(" years", "").trim()|| "1",
        abacusId: paramData.name === "Care Advantage" ? 6120 : paramData.name === "Care Supreme" ? 5367 : null,
        productId: paramData.name === "Reliance Gain" ? 2868 : paramData.name === "Reliance Infinity" ? 2824 : null,
      },
      proposerData: {
        selftitle: proposer.title,
        firstname: proposer.firstName,
        lastname: proposer.lastName,
        birthDate: proposer.dob,
        gender: proposer.gender,
        mobile: proposer.mobile,
        email: proposer.email,
        addressLine1: proposer.address1,
        addressLine2: proposer.address2,
        pincode: proposer.pincode,
        marital_status: proposer.maritalStatus,
        pan: proposer.pan,
        adharCardNumber: "",
        generatedCkycNumber: "",
        IndustryDetails: "",
        IndustryType: "",
        IsCrimeRecord: "",
        IsInvestableAssets: "",
        IsTotalAggregate: "",
        Occupation: "",
        ResidenceStatus: "",
        addons: "",
        nationality: ""
      },
      questionnaireResults: {},
      quotationData: {
        provider: paramData.company_name,
        code: paramData.name === "Care Advantage" ? 6120 : 5367 || null,
        productName: paramData.name,
        sumInsured: paramData.apiData.sumInsured,
        term: paramData.apiData.term.replace(" year", "").replace(" years", "").trim(),
        premium: String(paramData.apiData.premium).replace(/,/g, ""),
        premiumWithGST: String(paramData.apiData.premiumWithGST).replace(/,/g, "")
      },
      loginDetails : {
        userId: null,
        userType: null,
        isLoggedIn: false
      }
    };
      console.log(payload,"hello")
       const response = await axios.post(
        `${API_BASE_URL}/lmvpay/insurance/proposal`,
        payload
      );
      console.log(response,"response of proposal.......")
      Alert.alert('Success', 'All sections completed successfully!');
    }
  };

  // Navigate to previous tab
  const handleBack = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];
      setActiveTab(prevTab.id);
    }
  };

  // Improved Tabs Component - Compact and Clean
  const renderTabs = () => {
    const tabWidth = width / Math.min(tabs.length, 5);
    
    return (
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isCompleted = completedTabs.includes(tab.id);
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabItem,
                  { width: tabWidth },
                  isActive && styles.activeTabItem,
                ]}
                onPress={() => {
                  setActiveTab(tab.id);
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.tabIconWrapper,
                  isActive && styles.activeTabIconWrapper,
                  isCompleted && !isActive && styles.completedTabIconWrapper,
                ]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                  ) : (
                    <Ionicons
                      name={isActive ? tab.activeIcon : tab.icon}
                      size={20}
                      color={isActive ? '#1a3d5c' : '#666'}
                    />
                  )}
                </View>
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                  isCompleted && !isActive && styles.completedTabLabel,
                ]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Input field with error message
  const renderInputWithError = (label, value, onChange, error, placeholder, props = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  // Dropdown with error message
  const renderDropdownWithError = (label, value, options, onSelect, error, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <Dropdown
        value={value}
        options={options}
        placeholder={placeholder}
        onSelect={onSelect}
        containerStyle={error && styles.dropdownError}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  // Date picker with error message
  const renderDatePickerWithError = (label, date, onPress, error) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        style={[styles.dateButton, error && styles.inputError]}
        onPress={onPress}
      >
        <MaterialIcons name="date-range" size={18} color={error ? '#ff3b30' : '#666'} />
        <Text style={[styles.dateText, error && { color: '#ff3b30' }]}>
          {formatDate(date)}
        </Text>
        <Ionicons name="chevron-down" size={18} color={error ? '#ff3b30' : '#666'} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  // Render Proposer Details Tab
  const renderProposerDetails = () => (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      {renderDropdownWithError(
        'Title',
        proposer.title,
        titleOptions,
        (value) => updateProposer('title', value),
        proposerErrors.title,
        'Select Title'
      )}

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          {renderInputWithError(
            'First Name',
            proposer.firstName,
            (value) => updateProposer('firstName', value),
            proposerErrors.firstName,
            'Enter first name'
          )}
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          {renderInputWithError(
            'Last Name',
            proposer.lastName,
            (value) => updateProposer('lastName', value),
            proposerErrors.lastName,
            'Enter last name'
          )}
        </View>
      </View>

      {renderDatePickerWithError(
        'Date of Birth',
        proposer.dob,
        () => setShowProposerDatePicker(true),
        proposerErrors.dob
      )}

      {showProposerDatePicker && (
        <DateTimePicker
          value={proposer.dob}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onProposerDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          {renderDropdownWithError(
            'Marital Status',
            proposer.maritalStatus,
            maritalStatusOptions,
            (value) => updateProposer('maritalStatus', value),
            proposerErrors.maritalStatus,
            'Select Status'
          )}
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          {renderDropdownWithError(
            'Gender',
            proposer.gender,
            genderOptions,
            (value) => updateProposer('gender', value),
            proposerErrors.gender,
            'Select Gender'
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Contact Information</Text>

      {renderInputWithError(
        'Pincode',
        proposer.pincode,
        (value) => updateProposer('pincode', value),
        proposerErrors.pincode,
        'Enter pincode',
        { keyboardType: 'numeric', maxLength: 6 }
      )}

      {renderInputWithError(
        'Address Line 1',
        proposer.address1,
        (value) => updateProposer('address1', value),
        proposerErrors.address1,
        'Enter address',
        { multiline: true, numberOfLines: 2 }
      )}

      {renderInputWithError(
        'Address Line 2',
        proposer.address2,
        (value) => updateProposer('address2', value),
        null,
        'Enter address (optional)',
        { multiline: true, numberOfLines: 2 }
      )}

      {renderInputWithError(
        'Email Address',
        proposer.email,
        (value) => updateProposer('email', value),
        proposerErrors.email,
        'Enter email',
        { keyboardType: 'email-address', autoCapitalize: 'none' }
      )}

      {renderInputWithError(
        'Mobile Number',
        proposer.mobile,
        (value) => updateProposer('mobile', value),
        proposerErrors.mobile,
        'Enter mobile number',
        { keyboardType: 'phone-pad', maxLength: 10 }
      )}

      {renderInputWithError(
        'PAN Number',
        proposer.pan,
        (value) => updateProposer('pan', value.toUpperCase()),
        proposerErrors.pan,
        'Enter PAN',
        { autoCapitalize: 'characters', maxLength: 10 }
      )}
    </ScrollView>
  );

  // Render Nominee Details Tab
  const renderNomineeDetails = () => (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.sectionTitle}>Nominee Information</Text>

      {renderInputWithError(
        'Nominee Full Name',
        nominee.fullName,
        (value) => updateNominee('fullName', value),
        nomineeErrors.fullName,
        "Enter nominee's full name"
      )}

      {renderDatePickerWithError(
        'Date of Birth',
        nominee.dob,
        () => setShowNomineeDatePicker(true),
        nomineeErrors.dob
      )}

      {showNomineeDatePicker && (
        <DateTimePicker
          value={nominee.dob}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onNomineeDateChange}
          maximumDate={new Date()}
        />
      )}

      {renderDropdownWithError(
        'Relationship with Proposer',
        nominee.relationship,
        relationshipOptions,
        (value) => updateNominee('relationship', value),
        nomineeErrors.relationship,
        'Select Relationship'
      )}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#1a3d5c" />
        <Text style={styles.infoText}>
          Nominee is the person who will receive the insurance benefits.
        </Text>
      </View>
    </ScrollView>
  );

  // Render Member Details Tab
  const renderMemberDetails = () => (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Family Members to be Insured</Text>
        <TouchableOpacity style={styles.addButton} onPress={addMember}>
          <Ionicons name="add-circle" size={20} color="#1a3d5c" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {members.map((member, index) => {
        const errors = memberErrors[index] || {};
        
        return (
          <View key={index} style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberTitle}>Member {index + 1}</Text>
              {members.length > 1 && (
                <TouchableOpacity onPress={() => removeMember(index)}>
                  <Ionicons name="trash-outline" size={18} color="#ff3b30" />
                </TouchableOpacity>
              )}
            </View>

            {renderDropdownWithError(
              'Title',
              member.title,
              titleOptions,
              (value) => updateMember(index, 'title', value),
              errors.title,
              'Select Title'
            )}

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                {renderInputWithError(
                  'First Name',
                  member.firstName,
                  (value) => updateMember(index, 'firstName', value),
                  errors.firstName,
                  'Enter first name'
                )}
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                {renderInputWithError(
                  'Last Name',
                  member.lastName,
                  (value) => updateMember(index, 'lastName', value),
                  errors.lastName,
                  'Enter last name'
                )}
              </View>
            </View>

            {renderDatePickerWithError(
              'Date of Birth',
              member.dob,
              () => setShowMemberDatePicker(index),
              errors.dob
            )}

            {showMemberDatePicker === index && (
              <DateTimePicker
                value={member.dob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => onMemberDateChange(index, event, date)}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                {renderDropdownWithError(
                  'Marital Status',
                  member.maritalStatus,
                  maritalStatusOptions,
                  (value) => updateMember(index, 'maritalStatus', value),
                  errors.maritalStatus,
                  'Select Status'
                )}
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                {renderDropdownWithError(
                  'Relationship',
                  member.relationship,
                  relationshipOptions,
                  (value) => updateMember(index, 'relationship', value),
                  errors.relationship,
                  'Select Relationship'
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                {renderInputWithError(
                  'Height (CM)',
                  member.height,
                  (value) => updateMember(index, 'height', value),
                  errors.height,
                  'Enter height',
                  { keyboardType: 'numeric' }
                )}
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                {renderInputWithError(
                  'Weight (KG)',
                  member.weight,
                  (value) => updateMember(index, 'weight', value),
                  errors.weight,
                  'Enter weight',
                  { keyboardType: 'numeric' }
                )}
              </View>
            </View>

            {index < members.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </ScrollView>
  );

  // Render Bank Details Tab
  const renderBankDetails = () => (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.sectionTitle}>Bank Account Details</Text>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#1a3d5c" />
        <Text style={styles.infoText}>
          Please provide bank details for premium payments and claim settlements.
        </Text>
      </View>

      {renderInputWithError(
        'Name as per Bank Account',
        bankDetails.nameAsPerBankAccount,
        (value) => updateBankDetails('nameAsPerBankAccount', value),
        bankErrors.nameAsPerBankAccount,
        'Enter account holder name'
      )}

      {renderInputWithError(
        'Bank Name',
        bankDetails.bankName,
        (value) => updateBankDetails('bankName', value),
        bankErrors.bankName,
        'Enter bank name'
      )}

      {renderInputWithError(
        'Account Number',
        bankDetails.accountNumber,
        (value) => updateBankDetails('accountNumber', value),
        bankErrors.accountNumber,
        'Enter account number',
        { keyboardType: 'numeric' }
      )}

      {renderInputWithError(
        'IFSC Code',
        bankDetails.ifscCode,
        (value) => updateBankDetails('ifscCode', value.toUpperCase()),
        bankErrors.ifscCode,
        'Enter IFSC code',
        { autoCapitalize: 'characters', maxLength: 11 }
      )}

      {renderInputWithError(
        'Branch Name (Optional)',
        bankDetails.branchName,
        (value) => updateBankDetails('branchName', value),
        null,
        'Enter branch name'
      )}

      <View style={styles.verificationBox}>
        <Ionicons name="shield-checkmark" size={20} color="#34c759" />
        <Text style={styles.verificationText}>
          Your bank details are encrypted and securely stored.
        </Text>
      </View>
    </ScrollView>
  );

  // Render Tab Content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'proposer': return renderProposerDetails();
      case 'nominee': return renderNomineeDetails();
      case 'member': return renderMemberDetails();
      case 'medical': return renderProposerDetails();
      case 'bank': return renderBankDetails();
      default: return renderProposerDetails();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
           <HeaderWithPlanDetails />
          {/* Header */}
         
          {/* Compact Tabs */}
          {renderTabs()}

          {/* Tab Content */}
          <View style={styles.contentContainer}>
            {renderTabContent()}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.footer}>
            {tabs.findIndex(t => t.id === activeTab) > 0 ? (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={18} color="#666" />
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="save-outline" size={18} color="#666" />
                <Text style={styles.secondaryButtonText}>Save</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                !isContinueEnabled && styles.primaryButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={!isContinueEnabled}
            >
              <Text style={styles.primaryButtonText}>
                {activeTab === 'bank' ? 'Submit' : 'Next'}
              </Text>
              <Ionicons 
                name={activeTab === 'bank' ? "checkmark" : "arrow-forward"} 
                size={18} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerWithPlan: {
    backgroundColor: '#1a3d5c',
    paddingHorizontal: 16,
    paddingTop: 45,
  },
  planDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planProvider: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  planCode: {
    color: '#a0c8ff',
    fontSize: 11,
  },
  planDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 8,
  },
  planDetailItem: {
    alignItems: 'center',
  },
  planDetailLabel: {
    color: '#a0c8ff',
    fontSize: 10,
    marginBottom: 2,
  },
  planDetailValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planPremiumValue: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addonsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  addonsText: {
    color: '#34C759',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  stepIndicator: {
    paddingBottom: 12,
  },
  header: {
    backgroundColor: '#1a3d5c',
    paddingHorizontal: 16,
    
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#a0c8ff',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  tabsScrollContent: {
    paddingHorizontal: 4,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    position: 'relative',
  },
  activeTabItem: {
    backgroundColor: 'transparent',
  },
  tabIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 4,
  },
  activeTabIconWrapper: {
    backgroundColor: '#e8f1ff',
  },
  completedTabIconWrapper: {
    backgroundColor: '#f0fff4',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#1a3d5c',
    fontWeight: '700',
  },
  completedTabLabel: {
    color: '#34C759',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -10 }],
    width: 20,
    height: 2,
    backgroundColor: '#1a3d5c',
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3d5c',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButtonText: {
    color: '#1a3d5c',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  required: {
    color: '#ff3b30',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    fontSize: 14,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  dropdownError: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 11,
    marginTop: 2,
    marginLeft: 2,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    color: '#1a3d5c',
    fontSize: 12,
    lineHeight: 16,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a3d5c',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5ea',
    marginVertical: 12,
  },
  verificationBox: {
    backgroundColor: '#f0fff4',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  verificationText: {
    fontSize: 12,
    color: '#2e7d32',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1a3d5c',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#a0c8ff',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default ProposalForm;