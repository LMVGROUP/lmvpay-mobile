import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Dropdown from '../../../../components/DropDown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const emptyDetails = {
  title: 'Mr',
  name: '',
  phone: '',
  pincode: '',
  dob: '',
  sourceOfIncome: 'Salaried',
  occupation: 'Accountant',
  gender: 'Male',
  maritalStatus: 'Single',
};

const titleOptions = ['Mr', 'Ms', 'Mrs'];
const sourceOfIncomeOptions = ['Salaried', 'Self Employee', 'Pensioner', 'Non-Earning'];
const occupationOptions = [
  'Accountant',
  'Contractors',
  'Advocate',
  'Machine Operators',
  'Housemaid',
  'Jockeys',
  'Housewife'
];
const genderOptions = ['Male', 'Female'];
const maritalStatusOptions = ['Married', 'Single', 'Divorce'];
const numberOptions = ['0', '1', '2', '3', '4'];

export default function AccidentForm() {
  const [selectedMembers, setSelectedMembers] = useState({
    self: false,
    spouse: false,
    father: false,
    mother: false,
    fatherInLaw: false,
    motherInLaw: false,
  });
const router = useRouter();
  const [sonCount, setSonCount] = useState('0');
  const [daughterCount, setDaughterCount] = useState('0');

  const [familyData, setFamilyData] = useState({
    self: null,
    spouse: null,
    father: null,
    mother: null,
    fatherInLaw: null,
    motherInLaw: null,
    sons: [],
    daughters: [],
  });

  const [expandedSection, setExpandedSection] = useState(null);

  const selectedAdultCount = Object.values(selectedMembers).filter(Boolean).length;
  const canSelectMore = selectedAdultCount < 2;

  const toggleFamilyMember = (member) => {
    const isCurrentlySelected = selectedMembers[member];

    if (!isCurrentlySelected && !canSelectMore) {
      Alert.alert('Limit Reached', 'You can select maximum 2 adults');
      return;
    }

    setSelectedMembers((prev) => {
      const newState = { ...prev, [member]: !prev[member] };
      if (!prev[member]) {
        setFamilyData((prevData) => ({
          ...prevData,
          [member]: { ...emptyDetails },
        }));
        setExpandedSection(member);
      }
      return newState;
    });
  };

  const updatePersonDetails = (personKey, field, value) => {
    setFamilyData((prev) => ({
      ...prev,
      [personKey]: {
        ...prev[personKey],
        [field]: value,
      },
    }));
  };

  const updateChildDetails = (type, index, field, value) => {
    setFamilyData((prev) => {
      const children = [...prev[type]];
      children[index] = { ...children[index], [field]: value };
      return { ...prev, [type]: children };
    });
  };

  const updateSonCount = (count) => {
    const countNum = parseInt(count);
    setSonCount(count);
    setFamilyData((prev) => {
      const currentSons = prev.sons.length;
      if (countNum > currentSons) {
        const newSons = [...prev.sons];
        for (let i = currentSons; i < countNum; i++) {
          newSons.push({ ...emptyDetails, gender: 'Male' });
        }
        return { ...prev, sons: newSons };
      } else {
        return { ...prev, sons: prev.sons.slice(0, countNum) };
      }
    });
  };

  const updateDaughterCount = (count) => {
    const countNum = parseInt(count);
    setDaughterCount(count);
    setFamilyData((prev) => {
      const currentDaughters = prev.daughters.length;
      if (countNum > currentDaughters) {
        const newDaughters = [...prev.daughters];
        for (let i = currentDaughters; i < countNum; i++) {
          newDaughters.push({ ...emptyDetails, gender: 'Female' });
        }
        return { ...prev, daughters: newDaughters };
      } else {
        return { ...prev, daughters: prev.daughters.slice(0, countNum) };
      }
    });
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Form submitted successfully!');
    console.log('Form Data:', familyData);
    router.push('/products/insurance/pa/quotations');
  };

  const renderPersonForm = (personKey, label, data) => {
    if (!data) return null;

    const isExpanded = expandedSection === personKey;

    return (
      <View key={personKey} style={styles.memberCard}>
        <TouchableOpacity
          style={styles.memberHeader}
          onPress={() =>
            setExpandedSection(isExpanded ? null : personKey)
          }
        >
          <View style={styles.memberHeaderLeft}>
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={24}
              color="#007AFF"
            />
            <Text style={styles.memberLabel}>{label}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setSelectedMembers((prev) => ({
                ...prev,
                [personKey]: false,
              }));
              setFamilyData((prev) => ({
                ...prev,
                [personKey]: null,
              }));
              setExpandedSection(null);
            }}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.memberFormContainer}>
            <View style={styles.rowForm}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Dropdown
                  label="Title"
                  value={data.title}
                  options={titleOptions}
                  onSelect={(value) => updatePersonDetails(personKey, 'title', value)}
                  placeholder="Select title"
                />
              </View>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={data.name}
                  onChangeText={(text) =>
                    updatePersonDetails(personKey, 'name', text)
                  }
                  placeholder="Full name"
                />
              </View>
            </View>

            <View style={styles.rowForm}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={data.phone}
                  onChangeText={(text) =>
                    updatePersonDetails(personKey, 'phone', text)
                  }
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.input}
                  value={data.pincode}
                  onChangeText={(text) =>
                    updatePersonDetails(personKey, 'pincode', text)
                  }
                  placeholder="Pincode"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={data.dob}
                onChangeText={(text) =>
                  updatePersonDetails(personKey, 'dob', text)
                }
                placeholder="DD/MM/YYYY"
              />
            </View>

            <View style={styles.formGroup}>
              <Dropdown
                label="Source of Income"
                value={data.sourceOfIncome}
                options={sourceOfIncomeOptions}
                onSelect={(value) => updatePersonDetails(personKey, 'sourceOfIncome', value)}
                placeholder="Select source of income"
              />
            </View>

            <View style={styles.formGroup}>
              <Dropdown
                label="Occupation"
                value={data.occupation}
                options={occupationOptions}
                onSelect={(value) => updatePersonDetails(personKey, 'occupation', value)}
                placeholder="Select occupation"
              />
            </View>

            <View style={styles.rowForm}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Dropdown
                  label="Gender"
                  value={data.gender}
                  options={genderOptions}
                  onSelect={(value) => updatePersonDetails(personKey, 'gender', value)}
                  placeholder="Select gender"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Dropdown
                  label="Marital Status"
                  value={data.maritalStatus}
                  options={maritalStatusOptions}
                  onSelect={(value) => updatePersonDetails(personKey, 'maritalStatus', value)}
                  placeholder="Select marital status"
                />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView>
      <View style={styles.content}>
        <Text style={styles.header}>Personal Accident Form</Text>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#0066FF" />
          <Text style={styles.infoText}>
            Select up to 2 adults and add details for each
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Family Members</Text>
          <Text style={styles.sectionSubtitle}>Max 2 adults allowed</Text>

          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !canSelectMore && !selectedMembers.self && styles.disabledCheckbox,
            ]}
            onPress={() => toggleFamilyMember('self')}
            disabled={!canSelectMore && !selectedMembers.self}
          >
            <Ionicons
              name={selectedMembers.self ? 'checkbox' : 'square-outline'}
              size={24}
              color={!canSelectMore && !selectedMembers.self ? '#ccc' : '#007AFF'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                !canSelectMore && !selectedMembers.self && styles.disabledLabel,
              ]}
            >
              Self
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !canSelectMore && !selectedMembers.spouse && styles.disabledCheckbox,
            ]}
            onPress={() => toggleFamilyMember('spouse')}
            disabled={!canSelectMore && !selectedMembers.spouse}
          >
            <Ionicons
              name={selectedMembers.spouse ? 'checkbox' : 'square-outline'}
              size={24}
              color={!canSelectMore && !selectedMembers.spouse ? '#ccc' : '#007AFF'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                !canSelectMore && !selectedMembers.spouse && styles.disabledLabel,
              ]}
            >
              Spouse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !canSelectMore && !selectedMembers.father && styles.disabledCheckbox,
            ]}
            onPress={() => toggleFamilyMember('father')}
            disabled={!canSelectMore && !selectedMembers.father}
          >
            <Ionicons
              name={selectedMembers.father ? 'checkbox' : 'square-outline'}
              size={24}
              color={!canSelectMore && !selectedMembers.father ? '#ccc' : '#007AFF'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                !canSelectMore && !selectedMembers.father && styles.disabledLabel,
              ]}
            >
              Father
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !canSelectMore && !selectedMembers.mother && styles.disabledCheckbox,
            ]}
            onPress={() => toggleFamilyMember('mother')}
            disabled={!canSelectMore && !selectedMembers.mother}
          >
            <Ionicons
              name={selectedMembers.mother ? 'checkbox' : 'square-outline'}
              size={24}
              color={!canSelectMore && !selectedMembers.mother ? '#ccc' : '#007AFF'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                !canSelectMore && !selectedMembers.mother && styles.disabledLabel,
              ]}
            >
              Mother
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !canSelectMore && !selectedMembers.fatherInLaw && styles.disabledCheckbox,
            ]}
            onPress={() => toggleFamilyMember('fatherInLaw')}
            disabled={!canSelectMore && !selectedMembers.fatherInLaw}
          >
            <Ionicons
              name={selectedMembers.fatherInLaw ? 'checkbox' : 'square-outline'}
              size={24}
              color={!canSelectMore && !selectedMembers.fatherInLaw ? '#ccc' : '#007AFF'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                !canSelectMore && !selectedMembers.fatherInLaw && styles.disabledLabel,
              ]}
            >
              Father-in-Law
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !canSelectMore && !selectedMembers.motherInLaw && styles.disabledCheckbox,
            ]}
            onPress={() => toggleFamilyMember('motherInLaw')}
            disabled={!canSelectMore && !selectedMembers.motherInLaw}
          >
            <Ionicons
              name={selectedMembers.motherInLaw ? 'checkbox' : 'square-outline'}
              size={24}
              color={!canSelectMore && !selectedMembers.motherInLaw ? '#ccc' : '#007AFF'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                !canSelectMore && !selectedMembers.motherInLaw && styles.disabledLabel,
              ]}
            >
              Mother-in-Law
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Member Details</Text>
          {renderPersonForm('self', 'Self', familyData.self)}
          {renderPersonForm('spouse', 'Spouse', familyData.spouse)}
          {renderPersonForm('father', 'Father', familyData.father)}
          {renderPersonForm('mother', 'Mother', familyData.mother)}
          {renderPersonForm('fatherInLaw', 'Father-in-Law', familyData.fatherInLaw)}
          {renderPersonForm('motherInLaw', 'Mother-in-Law', familyData.motherInLaw)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children</Text>

          <View style={styles.dropdownGroup}>
            <View style={styles.dropdownContainer}>
              <Dropdown
                label="Number of Sons"
                value={sonCount}
                options={numberOptions}
                onSelect={updateSonCount}
                placeholder="Select number"
              />
            </View>

            <View style={styles.dropdownContainer}>
              <Dropdown
                label="Number of Daughters"
                value={daughterCount}
                options={numberOptions}
                onSelect={updateDaughterCount}
                placeholder="Select number"
              />
            </View>
          </View>

          {familyData.sons.map((son, index) => (
            <View key={`son-${index}`} style={styles.memberCard}>
              <TouchableOpacity
                style={styles.memberHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === `son-${index}` ? null : `son-${index}`
                  )
                }
              >
                <View style={styles.memberHeaderLeft}>
                  <Ionicons
                    name={
                      expandedSection === `son-${index}`
                        ? 'chevron-down'
                        : 'chevron-forward'
                    }
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.memberLabel}>Son {index + 1}</Text>
                </View>
              </TouchableOpacity>

              {expandedSection === `son-${index}` && (
                <View style={styles.memberFormContainer}>
                  <View style={styles.rowForm}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Dropdown
                        label="Title"
                        value={son.title}
                        options={titleOptions}
                        onSelect={(value) => updateChildDetails('sons', index, 'title', value)}
                        placeholder="Select title"
                      />
                    </View>
                    <View style={[styles.formGroup, { flex: 2 }]}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        style={styles.input}
                        value={son.name}
                        onChangeText={(text) =>
                          updateChildDetails('sons', index, 'name', text)
                        }
                        placeholder="Full name"
                      />
                    </View>
                  </View>

                  <View style={styles.rowForm}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>Phone</Text>
                      <TextInput
                        style={styles.input}
                        value={son.phone}
                        onChangeText={(text) =>
                          updateChildDetails('sons', index, 'phone', text)
                        }
                        placeholder="Phone"
                        keyboardType="phone-pad"
                      />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Pincode</Text>
                      <TextInput
                        style={styles.input}
                        value={son.pincode}
                        onChangeText={(text) =>
                          updateChildDetails('sons', index, 'pincode', text)
                        }
                        placeholder="Pincode"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                      style={styles.input}
                      value={son.dob}
                      onChangeText={(text) =>
                        updateChildDetails('sons', index, 'dob', text)
                      }
                      placeholder="DD/MM/YYYY"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Dropdown
                      label="Source of Income"
                      value={son.sourceOfIncome}
                      options={sourceOfIncomeOptions}
                      onSelect={(value) => updateChildDetails('sons', index, 'sourceOfIncome', value)}
                      placeholder="Select source of income"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Dropdown
                      label="Occupation"
                      value={son.occupation}
                      options={occupationOptions}
                      onSelect={(value) => updateChildDetails('sons', index, 'occupation', value)}
                      placeholder="Select occupation"
                    />
                  </View>

                  <View style={styles.rowForm}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Dropdown
                        label="Marital Status"
                        value={son.maritalStatus}
                        options={maritalStatusOptions}
                        onSelect={(value) => updateChildDetails('sons', index, 'maritalStatus', value)}
                        placeholder="Select marital status"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}

          {familyData.daughters.map((daughter, index) => (
            <View key={`daughter-${index}`} style={styles.memberCard}>
              <TouchableOpacity
                style={styles.memberHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === `daughter-${index}`
                      ? null
                      : `daughter-${index}`
                  )
                }
              >
                <View style={styles.memberHeaderLeft}>
                  <Ionicons
                    name={
                      expandedSection === `daughter-${index}`
                        ? 'chevron-down'
                        : 'chevron-forward'
                    }
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.memberLabel}>Daughter {index + 1}</Text>
                </View>
              </TouchableOpacity>

              {expandedSection === `daughter-${index}` && (
                <View style={styles.memberFormContainer}>
                  <View style={styles.rowForm}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Dropdown
                        label="Title"
                        value={daughter.title}
                        options={titleOptions}
                        onSelect={(value) => updateChildDetails('daughters', index, 'title', value)}
                        placeholder="Select title"
                      />
                    </View>
                    <View style={[styles.formGroup, { flex: 2 }]}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        style={styles.input}
                        value={daughter.name}
                        onChangeText={(text) =>
                          updateChildDetails('daughters', index, 'name', text)
                        }
                        placeholder="Full name"
                      />
                    </View>
                  </View>

                  <View style={styles.rowForm}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>Phone</Text>
                      <TextInput
                        style={styles.input}
                        value={daughter.phone}
                        onChangeText={(text) =>
                          updateChildDetails('daughters', index, 'phone', text)
                        }
                        placeholder="Phone"
                        keyboardType="phone-pad"
                      />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Pincode</Text>
                        <TextInput
                        style={styles.input}
                        value={daughter.pincode}
                        onChangeText={(text) =>
                          updateChildDetails('daughters', index, 'pincode', text)
                        }
                        placeholder="Pincode"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                      style={styles.input}
                      value={daughter.dob}
                      onChangeText={(text) =>
                        updateChildDetails('daughters', index, 'dob', text)
                      }
                      placeholder="DD/MM/YYYY"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Dropdown
                      label="Source of Income"
                      value={daughter.sourceOfIncome}
                      options={sourceOfIncomeOptions}
                      onSelect={(value) => updateChildDetails('daughters', index, 'sourceOfIncome', value)}
                      placeholder="Select source of income"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Dropdown
                      label="Occupation"
                      value={daughter.occupation}
                      options={occupationOptions}
                      onSelect={(value) => updateChildDetails('daughters', index, 'occupation', value)}
                      placeholder="Select occupation"
                    />
                  </View>

                  <View style={styles.rowForm}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Dropdown
                        label="Marital Status"
                        value={daughter.maritalStatus}
                        options={maritalStatusOptions}
                        onSelect={(value) => updateChildDetails('daughters', index, 'maritalStatus', value)}
                        placeholder="Select marital status"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-done" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>Submit Form</Text>
        </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  infoText: {
    fontSize: 14,
    color: '#0066FF',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  disabledCheckbox: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: '#ccc',
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    fontWeight: '500',
  },
  memberCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  memberHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  memberFormContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rowForm: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  dropdownGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});