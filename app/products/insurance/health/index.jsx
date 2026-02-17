import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserPayload } from '../../../../store/healthSlice';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'http://192.168.0.208:8000';

// Validation function for member combinations
const validateMemberCombinations = (members) => {
  const errors = [];
  
  const adults = members.filter(m => !['Son', 'Daughter'].includes(m.relation));
  const children = members.filter(m => ['Son', 'Daughter'].includes(m.relation));
  
  // Rule 1: Maximum 4 members total
  if (members.length > 4) {
    errors.push('Maximum 4 members allowed');
  }
  
  // Rule 2: Must have at least Self
  const hasSelf = members.some(m => m.relation === 'Self');
  if (!hasSelf) {
    errors.push('Self must be included');
  }
  
  // Rule 3: Only 1 Self allowed
  const selfCount = members.filter(m => m.relation === 'Self').length;
  if (selfCount > 1) {
    errors.push('Only one Self is allowed');
  }
  
  // Rule 4: Only 1 Spouse allowed
  const spouseCount = members.filter(m => m.relation === 'Spouse').length;
  if (spouseCount > 1) {
    errors.push('Only one Spouse is allowed');
  }
  
  // Rule 5: Maximum 2 adults
  if (adults.length > 2) {
    errors.push('Maximum 2 adults allowed');
  }
  
  // Rule 6: Check adult combinations when there are 2 adults
  if (adults.length === 2) {
    const hasSelf = adults.some(m => m.relation === 'Self');
    const hasSpouse = adults.some(m => m.relation === 'Spouse');
    const hasFather = adults.some(m => m.relation === 'Father');
    const hasMother = adults.some(m => m.relation === 'Mother');
    
    if (!hasSelf) {
      errors.push('One adult must be Self');
    }
    
    // Valid combinations: Self+Spouse, Self+Father, Self+Mother, Father+Mother
    if (hasSpouse && (hasFather || hasMother)) {
      errors.push('Cannot combine Spouse with Parents');
    }
  }
  
  // Rule 7: Check children age - UPDATED FOR FLEXIBILITY
  // children.forEach((child) => {
  //   const age = parseInt(child.age);
  //   if (!isNaN(age)) {
  //     if (child.relation === 'Son' && age > 25) {
  //       errors.push('Son must be 25 years or younger');
  //     }
  //     if (child.relation === 'Daughter' && age > 21) {
  //       errors.push('Daughter must be 21 years or younger');
  //     }
  //     if (age < 0) {
  //       errors.push('Age cannot be negative');
  //     }
  //   }
  // });
  
  // Rule 8: Maximum 2 children
  if (children.length > 2) {
    errors.push('Maximum 2 children allowed');
  }
  
  // Rule 9: If children exist, must have at least one adult
  if (children.length > 0 && adults.length === 0) {
    errors.push('Children must have at least one adult');
  }
  
  // Rule 10: Check for invalid combinations
  if (members.length >= 3) {
    const relations = members.map(m => m.relation);
    
    // Cannot have both Spouse and Parents
    if (relations.includes('Spouse') && 
        (relations.includes('Father') || relations.includes('Mother'))) {
      errors.push('Cannot include both Spouse and Parents');
    }
    
    // Cannot have more than 2 parents
    const parentCount = members.filter(m => ['Father', 'Mother'].includes(m.relation)).length;
    if (parentCount > 2) {
      errors.push('Maximum 2 parents allowed');
    }
  }
  
  return errors;
};

// Get display name with numbers for multiple same relations
const getRelationDisplayName = (members, relation, memberId) => {
  const sameRelations = members.filter(m => m.relation === relation);
  
  if (sameRelations.length <= 1) {
    return relation;
  }
  
  // Find position of this member among same relations
  const position = sameRelations.findIndex(m => m.id === memberId) + 1;
  
  switch(relation) {
    case 'Son': return `Son ${position}`;
    case 'Daughter': return `Daughter ${position}`;
    case 'Father': return `Father ${position}`;
    case 'Mother': return `Mother ${position}`;
    default: return relation;
  }
};

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [policyTenure, setPolicyTenure] = useState('1 Year');
  const [sumInsured, setSumInsured] = useState('₹10L');
  const [members, setMembers] = useState([
    { id: 1, relation: 'Self', age: '' }
  ]);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const relations = [
    { label: 'Self', icon: '👤' },
    { label: 'Spouse', icon: '💍' },
    { label: 'Father', icon: '👨' },
    { label: 'Mother', icon: '👩' },
    { label: 'Son', icon: '👶' },
    { label: 'Daughter', icon: '👧' }
  ];

  const sumInsuredOptions = ['₹5L', '₹7L','₹10L', '₹15L', '₹25L', '₹50L', '₹100L'];
  const tenureOptions = ['1 Year', '2 Year', '3 Year'];

  const processSumInsured = (value) => {
    return value.replace('₹', '').replace('L', '');
  };

  const getPolicyType = (members) => {
    if (members.length === 1 && members[0].relation === 'Self') {
      return 'Individual';
    }
    return 'Floater';
  };

const calculateAges = (members) => {
  const childrenAges = [];
  const adultAges = [];
  const familyAges = [];
  const familyMembers = []; // Add this array
  
  let highestElderAge = 0;
  
  members.forEach(member => {
    const age = parseInt(member.age);
    if (!isNaN(age)) {
      familyAges.push(age.toString());
      
      // Build familyMembers array
    familyMembers.push({
  relation: member.relation,
  age: age.toString()
});
      
      const isChild = ['Son', 'Daughter'].includes(member.relation);
      
      if (isChild) {
        childrenAges.push(age.toString());
      } else {
        adultAges.push(age.toString());
      }
      
      const isElder = ['Father', 'Mother'].includes(member.relation);
      if (isElder && age > highestElderAge) {
        highestElderAge = age;
      } else if (member.relation === 'Self' && age > highestElderAge) {
        highestElderAge = age;
      }
    }
  });
  
  return {
    childrenAges,
    adultAges,
    familyAges,
    familyMembers, // Include this in return
    highestElderAge: highestElderAge.toString(),
    noOfChildren: childrenAges.length.toString(),
    noOfPeople: members.length.toString(),
    noOfParents: members.filter(m => ['Father', 'Mother'].includes(m.relation)).length.toString()
  };
};

const viewQuote = async () => {
  if (!isFormComplete) {
    Alert.alert('Incomplete Form', 'Please fill all required fields');
    return;
  }

  try {
    setLoading(true);
    
    const agesData = calculateAges(members);
    
    const payload = {
      childrenAges: agesData.childrenAges,
      adultAges: agesData.adultAges,
      any_previous_medical_condition: "No",
      city: "Adilabad", // You might want to make this dynamic
      familyAges: agesData.familyAges,
      familyMembers: agesData.familyMembers, // Add this line
      firstname: firstName,
      highestElderAge: agesData.highestElderAge,
      lastname: lastName,
      noOfChildren: agesData.noOfChildren,
      noOfChild: agesData.noOfChildren,
      noOfParents: agesData.noOfParents,
      noOfPeople: agesData.noOfPeople,
      number: mobile,
      pincode: pincode,
      policyType: getPolicyType(members),
      providers: ["reliance"],
      selectedCoverage: processSumInsured(sumInsured),
      state: "Telangana", // You might want to make this dynamic
      tenure: policyTenure
    };

      console.log('Sending payload:', payload);
       dispatch(setUserPayload(payload));
      const response = await axios.post(
        `${API_BASE_URL}/lmvpay/insurance/quote`,
        payload
      );

      console.log('Response:', response);

      if (response.data && response.data.body.data) {
        router.push({
          pathname: '/products/insurance/health/quotations',
          params: { quotes: JSON.stringify(response.data.body.data), payload: JSON.stringify(payload)  }
        });
      } else {
        Alert.alert('No Quotes', 'No quotes available for the given criteria');
      }

    } catch (error) {
      console.error('Error fetching quotes:', error);
      
      let errorMessage = 'Failed to fetch quotes';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    if (members.length >= 4) {
      Alert.alert('Maximum Members', 'Maximum 4 members allowed');
      return;
    }
    
    const adults = members.filter(m => !['Son', 'Daughter'].includes(m.relation));
    const children = members.filter(m => ['Son', 'Daughter'].includes(m.relation));
    
    let defaultRelation = 'Self';
    
    // If already have 2 adults, default to child
    if (adults.length >= 2) {
      defaultRelation = children.length < 2 ? 'Son' : 'Spouse';
    }
    // If have Self but no Spouse, suggest Spouse
    else if (members.some(m => m.relation === 'Self') && 
             !members.some(m => m.relation === 'Spouse')) {
      defaultRelation = 'Spouse';
    }
    // If have Self+Spouse, suggest child
    else if (members.some(m => m.relation === 'Self') && 
             members.some(m => m.relation === 'Spouse') && 
             children.length < 2) {
      defaultRelation = 'Son';
    }
    // If have Self+Parent, suggest other Parent
    else if (members.some(m => m.relation === 'Self') && 
             (members.some(m => m.relation === 'Father') || 
              members.some(m => m.relation === 'Mother')) && 
             adults.length < 2) {
      defaultRelation = members.some(m => m.relation === 'Father') ? 'Mother' : 'Father';
    }
    
    const newMember = { 
      id: Date.now(), 
      relation: defaultRelation, 
      age: '' 
    };
    
    const testMembers = [...members, newMember];
    const errors = validateMemberCombinations(testMembers);
    
    if (errors.length > 0) {
      Alert.alert('Invalid Combination', errors[0]);
      return;
    }
    
    setMembers(testMembers);
  };

  const removeMember = (id) => {
    if (members.length > 1) {
      const memberToRemove = members.find(m => m.id === id);
      
      if (memberToRemove?.relation === 'Self') {
        Alert.alert('Cannot Remove Self', 'Self is required for the policy');
        return;
      }
      
      const updatedMembers = members.filter(member => member.id !== id);
      setMembers(updatedMembers);
    }
  };

const updateMember = (id, field, value) => {
  if (field === 'age') {
    const member = members.find(m => m.id === id);
    if (member) {
      const age = parseInt(value);
      
      // Don't validate empty age
      if (value === '') {
        const updatedMembers = members.map(member => 
          member.id === id ? { ...member, [field]: value } : member
        );
        setMembers(updatedMembers);
        return;
      }
      
      if (isNaN(age) || age < 0) {
        Alert.alert('Invalid Age', 'Age must be a positive number');
        return;
      }
      
      // Special age limits for children
    
      if (age > 99) {
        Alert.alert('Age Limit', 'Age cannot exceed 99 years');
        return;
      }
    }
  }
  
  const updatedMembers = members.map(member => 
    member.id === id ? { ...member, [field]: value } : member
  );
  
  const errors = validateMemberCombinations(updatedMembers);
  
  if (errors.length === 0) {
    setMembers(updatedMembers);
  } else {
    Alert.alert('Invalid Combination', errors[0]);
  }
};

  const openDropdown = (memberId) => {
    setSelectedDropdown(memberId);
  };

  const closeDropdown = () => {
    setSelectedDropdown(null);
  };

  const selectRelation = (memberId, relation) => {
    const updatedMembers = members.map(member => 
      member.id === memberId ? { ...member, relation } : member
    );
    
    const errors = validateMemberCombinations(updatedMembers);
    
    if (errors.length === 0) {
      setMembers(updatedMembers);
      closeDropdown();
    } else {
      Alert.alert('Invalid Relation', errors[0]);
    }
  };

  const getIconForRelation = (relation) => {
    const baseRelation = relation.split(' ')[0];
    const found = relations.find(r => r.label === baseRelation);
    return found ? found.icon : '👤';
  };

  const isFormComplete = firstName && lastName && mobile.length === 10 &&
    pincode.length === 6 && sumInsured &&
    members.every(m => m.age && !isNaN(m.age) && parseInt(m.age) > 0) &&
    validateMemberCombinations(members).length === 0;

  // Count members by type for display
  const adults = members.filter(m => !['Son', 'Daughter'].includes(m.relation));
  const children = members.filter(m => ['Son', 'Daughter'].includes(m.relation));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#1A365D" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.animationContainer}>
              <LottieView
                source={require('../../../../assets/animations/hospital.json')}
                autoPlay
                loop
                style={styles.lottieAnimation}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Health Insurance</Text>
            <Text style={styles.subtitle}>Fill details for quotes</Text>
          </View>
        </View>

        {/* Customer Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="person-outline" size={20} color="#0066CC" />
            <Text style={styles.cardTitle}>Customer Details</Text>
          </View>
          
          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Insured Members Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="group" size={20} color="#0066CC" />
            <View style={styles.cardHeaderText}>
              <View>
                <Text style={styles.cardTitle}>Insured Members</Text>
                <Text style={styles.memberSummary}>
                  {adults.length} Adult{adults.length !== 1 ? 's' : ''}, {children.length} Child{children.length !== 1 ? 'ren' : ''}
                </Text>
              </View>
              <Text style={styles.memberLimit}>
                {members.length}/4 members
              </Text>
            </View>
          </View>

          {members.map((member, index) => {
            const displayRelation = getRelationDisplayName(members, member.relation, member.id);
            
            return (
              <View key={member.id} style={styles.memberRow}>
                <View style={styles.memberNumber}>
                  <Text style={styles.memberNumberText}>{index + 1}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.relationSelector}
                  onPress={() => openDropdown(member.id)}
                >
                  <Text style={styles.relationIcon}>
                    {getIconForRelation(member.relation)}
                  </Text>
                  <Text style={styles.relationText}>{displayRelation}</Text>
                  <MaterialIcons name="arrow-drop-down" size={18} color="#666" />
                </TouchableOpacity>
                
                <View style={styles.ageInputContainer}>
                  <TextInput
                    style={styles.ageInput}
                    placeholder="Age"
                    value={member.age}
                    onChangeText={(value) => updateMember(member.id, 'age', value)}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholderTextColor="#999"
                  />
                </View>
                
                {members.length > 1 && member.relation !== 'Self' && (
                  <TouchableOpacity
                    onPress={() => removeMember(member.id)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="close" size={18} color="#FF4444" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {members.length < 4 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={addMember}
            >
              <Ionicons name="add-circle-outline" size={18} color="#0066CC" />
              <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
          )}

          <Modal
            visible={selectedDropdown !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={closeDropdown}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeDropdown}
            >
              <View style={styles.dropdownModal}>
                {relations.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.dropdownItem}
                    onPress={() => selectRelation(selectedDropdown, item.label)}
                  >
                    <Text style={styles.dropdownItemIcon}>{item.icon}</Text>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                    {members.find(m => m.id === selectedDropdown)?.relation === item.label && (
                      <MaterialIcons name="check" size={18} color="#0066CC" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* Coverage Rules Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="info" size={20} color="#0066CC" />
            <Text style={styles.cardTitle}>Coverage Rules</Text>
          </View>
          
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.ruleText}>
                <Text style={styles.boldText}>Maximum 4 members</Text> (2 adults + 2 children)
              </Text>
            </View>
            
            <View style={styles.ruleItem}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.ruleText}>
                <Text style={styles.boldText}>Valid combinations:</Text>
              </Text>
            </View>
            
            <View style={styles.subRules}>
              <Text style={styles.subRuleText}>• Self + Spouse</Text>
              <Text style={styles.subRuleText}>• Self + Father/Mother</Text>
              <Text style={styles.subRuleText}>• Self + Spouse + Children</Text>
              <Text style={styles.subRuleText}>• Self + Parents (Father+Mother)</Text>
            </View>
            
            <View style={styles.ruleItem}>
              <MaterialIcons name="warning" size={16} color="#FF9800" />
              <Text style={styles.ruleText}>
                <Text style={styles.boldText}>Children:</Text> Age must be 18 or younger
              </Text>
            </View>
          </View>
        </View>

        {/* Policy Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="policy" size={20} color="#0066CC" />
            <Text style={styles.cardTitle}>Policy Details</Text>
          </View>

          <Text style={styles.sectionLabel}>Policy Tenure</Text>
          <View style={styles.chipContainer}>
            {tenureOptions.map((tenure) => (
              <TouchableOpacity
                key={tenure}
                style={[
                  styles.chip,
                  policyTenure === tenure && styles.chipSelected
                ]}
                onPress={() => setPolicyTenure(tenure)}
              >
                <Text style={[
                  styles.chipText,
                  policyTenure === tenure && styles.chipTextSelected
                ]}>
                  {tenure}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Sum Insured</Text>
          <View style={styles.chipContainer}>
            {sumInsuredOptions.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.chip,
                  sumInsured === amount && styles.chipSelected
                ]}
                onPress={() => setSumInsured(amount)}
              >
                <Text style={[
                  styles.chipText,
                  sumInsured === amount && styles.chipTextSelected
                ]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <View style={styles.securityNote}>
          <MaterialIcons name="lock" size={14} color="#666" />
          <Text style={styles.securityText}>Secure & confidential</Text>
        </View>
        
        <TouchableOpacity
          onPress={viewQuote}
          disabled={loading || !isFormComplete}
          style={[styles.ctaButton, (!isFormComplete || loading) && styles.ctaButtonDisabled]}
        >
          <LinearGradient
            colors={isFormComplete && !loading ? ['#0066CC', '#0099FF'] : ['#CCCCCC', '#999999']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.ctaText}>View Quotes</Text>
                <MaterialIcons name="arrow-forward" size={18} color="white" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  animationContainer: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B3E0FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A365D',
  },
  memberSummary: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  memberLimit: {
    fontSize: 12,
    color: '#666',
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  memberNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  relationSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  relationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  relationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  ageInputContainer: {
    width: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  ageInput: {
    height: 36,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#0066CC',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dropdownModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 280,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  rulesList: {
    marginTop: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 13,
    color: '#1A365D',
    marginLeft: 8,
    flex: 1,
  },
  boldText: {
    fontWeight: '600',
  },
  subRules: {
    marginLeft: 24,
    marginBottom: 8,
  },
  subRuleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A365D',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  chipSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  chipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  ctaButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginRight: 6,
  },
});

export default index;