import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter,useFocusEffect  } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';


// Static add-ons data by plan type with dropdown options
const addOnsByPlan = {
  'care supreme': [
    {
      id: 'addon-1',
      name: 'Wellness Benefit',
      description: 'Health and wellness benefits package',
      type: 'checkbox',
      mandatory: true
    },
    {
      id: 'addon-2',
      name: 'Air Ambulance',
      description: 'Emergency air ambulance coverage',
      type: 'checkbox',
      mandatory: true
    },
    {
      id: 'addon-3',
      name: 'NCB Super',
      description: 'Enhanced No Claim Bonus benefits',
      type: 'checkbox',
      mandatory: true
    },
    {
      id: 'field_BFB',
      name: 'Be-Fit Benefits',
      description: 'Fitness and wellness program benefits',
      type: 'checkbox'
    },
    {
      id: 'field_AHC',
      name: 'Annual Health Check-up',
      description: 'Comprehensive annual health checkup',
      type: 'checkbox'
    },
    {
      id: 'field_IC',
      name: 'Instant Cover',
      description: 'Immediate coverage activation',
      type: 'checkbox'
    },
    {
      id: 'field_CS',
      name: 'Claim Shield',
      description: 'Enhanced claim processing protection',
      type: 'checkbox'
    },
    {
      id: 'field_OPD',
      name: 'Care OPD',
      description: 'Outpatient department coverage',
      type: 'checkbox'
    },
    {
      id: 'field_PED_TENURE',
      name: 'Reduction PED',
      description: 'Reduced pre-existing disease waiting period',
      type: 'dropdown',
      options: [
        { id: 'field_PED_TENURE1', name: '1 Year' },
        { id: 'field_PED_TENURE2', name: '2 Year' }
      ]
    }
  ],
  'care advantage': [
    {
      id: 'field_UEC',
      name: 'Unlimited E-Consultations',
      description: 'Unlimited online doctor consultations during the policy period.',
      type: 'checkbox',
      mandatory: true
    },
    {
      id: 'field_CSP',
      name: 'Care Shield Plus',
      description: 'Covers non-payable and additional claim related expenses.',
      type: 'checkbox',
      mandatory: true
    },
    {
      id: 'field_NCB',
      name: 'NCB Super',
      description: 'Increases sum insured for every claim-free year.',
      type: 'checkbox'
    },
    {
      id: 'field_34',
      name: 'Room Rent Modification',
      description: 'Allows higher room category by reducing room rent limits.',
      type: 'checkbox'
    },
    {
      id: 'field_35',
      name: 'Air Ambulance Cover',
      description: 'Covers emergency air ambulance transportation expenses.',
      type: 'checkbox'
    },
    {
      id: 'field_UAR',
      name: 'Unlimited Automatic Recharge',
      description: 'Restores sum insured automatically after it is exhausted.',
      type: 'checkbox'
    },
    {
      id: 'field_OPD',
      name: 'Care OPD',
      description: 'Covers outpatient consultation and medical expenses.',
      type: 'checkbox'
    },
    {
      id: 'field_PPH',
      name: 'Pre-Post Hospitalization Expenses',
      description: 'Covers medical expenses before and after hospitalization.',
      type: 'checkbox'
    },
    {
      id: 'field_AHC',
      name: 'Annual Health Checkup',
      description: 'Provides a free health check-up every policy year.',
      type: 'checkbox'
    },
    {
      id: 'field_43',
      name: 'Reduction in PED',
      description: 'Reduces waiting period for pre-existing diseases.',
      type: 'checkbox'
    },
    {
      id: 'field_SS',
      name: 'Smart Select',
      description: 'Offers a discounted premium by choosing predefined coverage and limits.',
      type: 'checkbox'
    }
  ]

  ,
  'reliance gain': [
    {
      id: 'EnhancedCover',
      name: 'Enhanced Cover',
      description: 'Enhanced coverage limits',
      type: 'checkbox'
    },
    {
      id: 'ConvienceCover',
      name: 'Convience Cover',
      description: 'Convenience and easy claim processing',
      type: 'checkbox'
    },
    {
      id: 'DoubleCover',
      name: 'Double Cover',
      description: 'Double sum insured benefit',
      type: 'checkbox'
    },
    {
      id: 'FamilyCareCover',
      name: 'Family Care Cover',
      description: 'Extended family coverage',
      type: 'checkbox'
    },
    {
      id: 'SmartCover',
      name: 'Smart Cover',
      description: 'Smart coverage options',
      type: 'checkbox'
    },
    {
      id: 'PreventiveCover',
      name: 'Preventive Cover',
      description: 'Preventive healthcare coverage',
      type: 'checkbox'
    },
    {
      id: 'addon-16',
      name: 'Room Rent',
      description: 'Room rent coverage type',
      type: 'dropdown',
      options: [
        { id: 'Twin Sharing', name: 'Twin Sharing' },
        { id: 'Single AC Private Room', name: 'Single AC Private Room' },
        { id: 'Actuals', name: 'Actuals' }
      ]
    },
    {
      id: 'addon-17',
      name: 'Voluntary Deductible',
      description: 'Choose your deductible amount',
      type: 'dropdown',
      options: [
        { id: '10000', name: '10000' },
        { id: '25000', name: '25000' },
        { id: '50000', name: '50000' },
        { id: '100000', name: '100000' }
      ]
    }
  ],

  'reliance infinity': [
    {
      id: 'LimitlessCover',
      name: 'Limitless Cover',
      description: 'No upper limit on coverage',
      type: 'checkbox'
    },
    {
      id: 'DoubleCover',
      name: 'Double Cover',
      description: 'Double sum insured benefit',
      type: 'checkbox'
    },
    {
      id: 'HomeTreatment',
      name: 'Home Treatment',
      description: 'Home-based treatment coverage',
      type: 'checkbox'
    },
    {
      id: 'MedicalEquipmentCover',
      name: 'Medical Equipment Cover',
      description: 'Medical equipment coverage',
      type: 'checkbox'
    },
    {
      id: 'SpecificIllnessWaitingPeriod',
      name: 'Specific Illness Waiting Period',
      description: 'Reduced waiting period for specific illnesses',
      type: 'checkbox'
    },
    {
      id: 'PreExistingWaitingPeriod',
      name: 'Pre Existing Waiting Period',
      description: 'Choose waiting period for pre-existing diseases',
      type: 'dropdown',
      options: [
        { id: '12 Months', name: '12 months' },
        { id: '24 Months', name: '24 months' }
      ]
    },
    {
      id: 'ReductionInRoomRent',
      name: 'Room Rent',
      description: 'Room rent coverage type',
      type: 'dropdown',
      options: [
        { id: 'Twin Sharing', name: 'Twin Sharing' },
        { id: 'Single Private AC Room', name: 'Single Private AC Room' }
      ]
    },
    {
      id: 'VoluntaryAggregateDeductible',
      name: 'Voluntary Deductible',
      description: 'Choose your deductible amount',
      type: 'dropdown',
      options: [
        { id: '10000', name: '-10,000', price: 'VoluntaryAggregateDeductible' },
        { id: '25000', name: '-25,000', price: 'VoluntaryAggregateDeductible' },
        { id: '50000', name: '-50,000', price: 'VoluntaryAggregateDeductible' },
        { id: '100000', name: '-1,00,000', price: 'VoluntaryAggregateDeductible' }
      ]
    },
    {
      id: 'SmartProtector',
      name: 'Smart Protector',
      description: 'Annual sum insured increase',
      type: 'dropdown',
      options: [
        { id: 'smart-20', name: '20% sum insured every year' },
        { id: 'smart-30', name: '30% sum insured every year' }
      ]
    }
  ],

  'default': [
    {
      id: 'addon-30',
      name: 'Critical Illness',
      price: 50000,
      description: 'Coverage for 30 critical illnesses',
      type: 'checkbox'
    },
    {
      id: 'addon-31',
      name: 'OPD Coverage',
      price: 30000,
      description: 'Outpatient department coverage',
      type: 'checkbox'
    },
    {
      id: 'addon-32',
      name: 'Dental Care',
      price: 20000,
      description: 'Dental treatments and checkups',
      type: 'checkbox'
    },
    {
      id: 'addon-33',
      name: 'Personal Accident',
      price: 40000,
      description: 'Accidental death and disability',
      type: 'checkbox'
    },
    {
      id: 'addon-34',
      name: 'Wellness Program',
      price: 25000,
      description: 'Fitness and nutrition counseling',
      type: 'checkbox'
    },
  ]
};

// Static features for all plans
const staticFeatures = [
  'Room rent up to ₹5000 per day',
  'Pre & Post Hospitalization',
  'Day Care Procedures',
  'Annual Health Checkup',
  'Maternity Cover',
];

// Static highlights
const staticHighlights = [
  'Cashless at 5000+ hospitals',
  'No co-payment',
  'Restoration benefit',
  '24/7 claim support',
];

// API Configuration
const API_BASE_URL = 'http://192.168.0.208:8000';

export default function HealthQuotations() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [dropdownValues, setDropdownValues] = useState({});
  const [submittingPlan, setSubmittingPlan] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState({});
  const [apiData, setApiData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [loadingAddOns, setLoadingAddOns] = useState({});
  const [loadingDropdowns, setLoadingDropdowns] = useState({});
  const [calculatedPremiums, setCalculatedPremiums] = useState({});
  const [payloadC, setPayload] = useState(null);
  const quotesParam = params.quotes;
  const formId = params.formId;
  const payloadParam = params.payload;
  useEffect(() => {
    try {
      if (params.payload) {
        const parsedPayload = JSON.parse(params.payload);
        setPayload(parsedPayload);
      }
    } catch (error) {

    }
  }, [payloadParam])

  console.log(payloadC)
   useFocusEffect(() => {
    setSubmittingPlan(null);
  });
  // Function to get plan-specific add-ons based on plan name
  const getAddOnsForPlan = (planName) => {
    if (!planName) return addOnsByPlan['default'];

    const lowerName = planName.toLowerCase().trim();

    if (lowerName.includes('care supreme')) {
      return addOnsByPlan['care supreme'];
    }
    else if (lowerName.includes('care advantage')) {
      return addOnsByPlan['care advantage'];
    }
    else if (lowerName.includes('reliance gain')) {
      return addOnsByPlan['reliance gain'];
    } else if (lowerName.includes('reliance infinity')) {
      return addOnsByPlan['reliance infinity'];
    }

    return addOnsByPlan['default'];
  };

  useEffect(() => {
    if (quotesParam) {
      try {
        const parsedQuotes = JSON.parse(params.quotes);

        if (Array.isArray(parsedQuotes) && parsedQuotes.length > 0) {
          setApiData(parsedQuotes);

          const transformedPlans = parsedQuotes.map((quote, index) => {
            const providerName = quote.provider || '';
            const planName = quote.productName || 'Health Insurance Plan';
            const logoUrl = getLogoUrl(providerName);
            const planAddOns = getAddOnsForPlan(planName);

            const planId = `plan-${quote.code || index}`;
            const basePremium = parseFloat(quote.premium?.replace(/,/g, '') || '0') * 100;
            const premiumWithGST = parseFloat(quote.premiumWithGST?.replace(/,/g, '') || quote.premium?.replace(/,/g, '') || '0') * 100;

            return {
              id: planId,
              name: planName,
              company_name: providerName,
              premium: basePremium,
              premiumWithGST: premiumWithGST,
              basePremium: basePremium, // Store original base premium
              basePremiumWithGST: premiumWithGST, // Store original base premium with GST
              coverage_amount: parseInt(quote.sumInsured || '1000000'),
              term: quote.term || '1',
              code: quote.code,
              features: staticFeatures,
              add_ons: planAddOns,
              highlights: staticHighlights,
              apiData: quote,
              logoUrl: logoUrl,
            };
          });

          setPlans(transformedPlans);

          // Initialize calculated premiums
          const initialCalculatedPremiums = {};
          transformedPlans.forEach(plan => {
            initialCalculatedPremiums[plan.id] = plan.premiumWithGST || plan.premium;
          });
          setCalculatedPremiums(initialCalculatedPremiums);

          // Initialize selected add-ons and dropdown values
          const initialAddOns = {};
          const initialDropdowns = {};
          transformedPlans.forEach((plan) => {
            initialAddOns[plan.id] = new Set();
            initialDropdowns[plan.id] = {};

            // Initialize dropdown values
            plan.add_ons.forEach(addOn => {
              if (addOn.type === 'dropdown' && addOn.options && addOn.options.length > 0) {
                initialDropdowns[plan.id][addOn.id] = null;
              }
            });
          });
          setSelectedAddOns(initialAddOns);
          setDropdownValues(initialDropdowns);
            setSubmittingPlan(null);
        } else {
          Alert.alert('No Quotes', 'No insurance quotes available for your criteria.');
        }
      } catch (error) {
        console.error('Error parsing quotes:', error);
        Alert.alert('Error', 'Failed to parse insurance quotes.');
      }
    } else {
      console.log("No quotes found in params");
      Alert.alert('No Data', 'No insurance data received.');
    }

    setLoading(false);
  }, [quotesParam]);

  // Function to calculate premium with add-ons via API
  // Function to calculate premium with add-ons via API
  const calculatePremiumWithAddOns = async (planId, addOnId, isSelected = null, option = null) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan || !plan.apiData) return null;

    try {
      // Get the specific add-on that was clicked
      const clickedAddOn = plan.add_ons.find(ao => ao.id === addOnId);

      if (!clickedAddOn && addOnId) {
        console.warn(`Add-on with id ${addOnId} not found`);
        return null;
      }

      // Get current selected add-ons to send all of them
      const currentSelectedAddOns = new Set(selectedAddOns[planId] || []);
      const currentDropdownVals = { ...dropdownValues[planId] || {} };

      // Temporarily update for API call
      let tempSelectedAddOns = new Set(currentSelectedAddOns);
      let tempDropdownVals = { ...currentDropdownVals };

      if (addOnId && isSelected !== null) {
        if (isSelected) {
          tempSelectedAddOns.add(addOnId);
          if (option) {
            tempDropdownVals[addOnId] = option;
          }
        } else {
          tempSelectedAddOns.delete(addOnId);
          delete tempDropdownVals[addOnId];
        }
      }

      // Prepare payload with ALL currently selected add-ons
      const addonPayload = {
        adultAges: payloadC?.adultAges || [],
        any_previous_medical_condition: "No",
        highestElderAge: payloadC?.highestElderAge || 0,
        childrenAges: payloadC?.childrenAges || [],
        city: payloadC?.city || "",
        familyAges: payloadC?.familyAges || [],
        firstname: payloadC?.firstname || "",
        lastname: payloadC?.lastname || "",
        noOfChild: payloadC?.noOfChild || 0,
        noOfParents: payloadC?.noOfParents || 0,
        noOfPeople: payloadC?.noOfPeople || 0,
        number: payloadC?.number || "",
        pincode: payloadC?.pincode || "",
        policyType: payloadC?.policyType || "",
        providers: [plan.company_name.toLowerCase()],
        selectedCoverage: payloadC?.selectedCoverage || 0,
        state: payloadC?.state || "",
        tenure: payloadC?.tenure || "",
        productName: plan.name
      };

      // Add all selected add-ons to payload
    
      plan.add_ons.forEach(addOn => {
        if (tempSelectedAddOns.has(addOn.id)) {
          // Add add-on ID with value "1"
          addonPayload[addOn.id] =addonPayload.productName === "Reliance Gain" ? true : "1";
          // Add dropdown option if available
          if (addOn.type === 'dropdown') {
            const selectedOption = tempDropdownVals[addOn.id];
            console.log(addOn, "seelcted option")
            if (selectedOption) {
              if (selectedOption.id === "field_PED_TENURE1" || selectedOption.id === "field_PED_TENURE2") {
                addonPayload[`${addOn.id}`] = selectedOption.name;
                addonPayload.field_43 = "1"
              } else if (selectedOption.id === "12 Months" || selectedOption.id === "24 Months") {
                addonPayload.PEDRangeInfinity = selectedOption.id
              }
              else if (selectedOption.id === "Twin Sharing" || selectedOption.id === "Single Private AC Room") {
                addonPayload.roomRentTypeInfinity = selectedOption.id
              }
              else if (selectedOption.id === "10000" && addOn.id ==='VoluntaryAggregateDeductible' || selectedOption.id === "25000" && addOn.id ==='VoluntaryAggregateDeductible' || selectedOption.id === "50000" && addOn.id ==='VoluntaryAggregateDeductible' || selectedOption.id === "100000" && addOn.id ==='VoluntaryAggregateDeductible') {
                addonPayload.VoluntaryAggregateDeductible = true;
                addonPayload.DeductibleInfinity = selectedOption.id;
              }
               else if (selectedOption.id === "10000" && addOn.id =="addon-17" || selectedOption.id === "25000" && addOn.id =="addon-17" || selectedOption.id === "50000" && addOn.id =="addon-17" || selectedOption.id === "100000" && addOn.id =="addon-17") {
                addonPayload.VoluntaryAggregateDeductible = true;
                addonPayload.DeductibleGain = selectedOption.id;
               addonPayload.SelectedDeductible = true;
              }
              else {
                addonPayload[`${addOn.id}`] = selectedOption.id;
              }

            }
          }
        }
      });

      console.log('Making API call for add-ons:', JSON.stringify(addonPayload, null, 2));

      const response = await axios.post(
        `${API_BASE_URL}/lmvpay/insurance/quote`,
        addonPayload
      );

      console.log('API Response:', response.data.body.data);

      if (response.data && response.data.body && response.data.body.data) {
        const apiResponse = response.data.body.data;

        if (Array.isArray(apiResponse) && apiResponse.length > 0) {
          const updatedPlanData = apiResponse[0]; // Assuming first item is our updated plan

          // Parse premium values
          const updatedPremium = parseFloat(updatedPlanData.premium?.replace(/,/g, '') || '0') * 100;
          const updatedPremiumWithGST = parseFloat(updatedPlanData.premiumWithGST?.replace(/,/g, '') || updatedPlanData.premium?.replace(/,/g, '') || '0') * 100;

          // Update the plan with new premium values
          setPlans(prevPlans =>
            prevPlans.map(p => {
              if (p.id === planId) {
                return {
                  ...p,
                  premium: updatedPremium,
                  premiumWithGST: updatedPremiumWithGST,
                  basePremium: updatedPremium, // Update base premium as well
                  basePremiumWithGST: updatedPremiumWithGST,
                  // Update apiData with new quote
                  apiData: {
                    ...p.apiData,
                    premium: updatedPlanData.premium,
                    premiumWithGST: updatedPlanData.premiumWithGST,
                    oddOns: updatedPlanData.oddOns || []
                  }
                };
              }
              return p;
            })
          );

          // Also update calculated premiums
          setCalculatedPremiums(prev => ({
            ...prev,
            [planId]: updatedPremiumWithGST
          }));

          // Update selected add-ons state if needed
          if (addOnId && isSelected !== null) {
            setSelectedAddOns((prev) => {
              const planAddOns = new Set(prev[planId] || []);
              if (isSelected) {
                planAddOns.add(addOnId);
              } else {
                planAddOns.delete(addOnId);
              }
              return { ...prev, [planId]: planAddOns };
            });
          }

          // Update dropdown values if needed
          if (addOnId && option) {
            setDropdownValues(prev => ({
              ...prev,
              [planId]: {
                ...prev[planId],
                [addOnId]: option
              }
            }));
          }

          return {
            success: true,
            premium: updatedPremiumWithGST,
            updatedPlanData: updatedPlanData
          };
        }
      }

      // Fallback to local calculation if API response is not as expected
      console.warn('Unexpected API response format, falling back to local calculation');
      const calculatedPremium = calculatePremiumLocally(plan, tempSelectedAddOns, tempDropdownVals);

      return {
        success: false,
        premium: calculatedPremium,
        message: 'Using local calculation'
      };

    } catch (error) {
      console.error('Error calculating premium:', error);

      // Fallback to local calculation
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        const tempSelectedAddOns = new Set(selectedAddOns[planId] || []);
        const tempDropdownVals = { ...dropdownValues[planId] || {} };

        if (addOnId && isSelected !== null) {
          if (isSelected) {
            tempSelectedAddOns.add(addOnId);
            if (option) {
              tempDropdownVals[addOnId] = option;
            }
          } else {
            tempSelectedAddOns.delete(addOnId);
            delete tempDropdownVals[addOnId];
          }
        }

        const calculatedPremium = calculatePremiumLocally(plan, tempSelectedAddOns, tempDropdownVals);

        return {
          success: false,
          premium: calculatedPremium,
          message: 'Error occurred, using local calculation'
        };
      }

      throw error;
    }
  };

  // Local calculation function for fallback
  const calculatePremiumLocally = (plan, selectedAddOnsSet, dropdownVals) => {
    let total = plan.basePremiumWithGST || plan.basePremium;

    selectedAddOnsSet.forEach(addOnId => {
      const addOn = plan.add_ons.find(ao => ao.id === addOnId);
      if (addOn) {
        if (addOn.type === 'checkbox') {
          total += addOn.price || 0;
        } else if (addOn.type === 'dropdown') {
          const selectedOption = dropdownVals[addOnId];
          if (selectedOption) {
            total += selectedOption.price || 0;
          }
        }
      }
    });

    return Math.max(total, 0);
  };

  const toggleAddOn = async (planId, addOnId) => {
    // Get plan and add-on details
    const plan = plans.find(p => p.id === planId);
    const addOn = plan?.add_ons?.find(ao => ao.id === addOnId);

    // Check if add-on is mandatory
    if (addOn?.mandatory) {
      // Don't allow toggling mandatory add-ons
      Alert.alert('Mandatory Add-on', `${addOn.name} is a mandatory inclusion and cannot be removed.`);
      return;
    }

    // Show loading for this add-on
    setLoadingAddOns(prev => ({
      ...prev,
      [`${planId}-${addOnId}`]: true
    }));

    try {
      const isCurrentlySelected = (selectedAddOns[planId] || new Set()).has(addOnId);
      const newSelectedState = !isCurrentlySelected;

      if (!addOn || !plan) return;
      // If it's a dropdown and we're selecting it, don't toggle yet - let dropdown selection handle it
      if (addOn.type === 'dropdown') {
        if (isCurrentlySelected) {
          // If already selected, prompt to remove
          Alert.alert(
            'Remove Add-on',
            `Do you want to remove ${addOn.name}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', onPress: () => removeDropdownOption(planId, addOnId) }
            ]
          );
        } else {
          // For dropdowns, open modal to select option
          openDropdownModal(planId, addOn);
        }
        return;
      }
      // If it's a dropdown and we're selecting it, don't toggle yet - let dropdown selection handle it
      if (addOn.type === 'dropdown' && newSelectedState) {
        // For dropdowns, we'll handle selection in the dropdown modal
        openDropdownModal(planId, addOn);
        return;
      }

      // Make API call to calculate new premium
      const result = await calculatePremiumWithAddOns(planId, addOnId, newSelectedState);

      if (result) {
        // Note: The state is already updated in calculatePremiumWithAddOns
        // because we need to send all selected add-ons to the API

        if (result.success) {
          // Show success message if needed
          if (result.updatedPlanData) {
            console.log('Premium updated successfully:', result.updatedPlanData);
          }
        } else {
          // If using local calculation, still update selected state
          setSelectedAddOns((prev) => {
            const planAddOns = new Set(prev[planId] || []);
            if (planAddOns.has(addOnId)) {
              planAddOns.delete(addOnId);
            } else {
              planAddOns.add(addOnId);
            }
            return { ...prev, [planId]: planAddOns };
          });

          // Update calculated premium for this plan
          setCalculatedPremiums(prev => ({
            ...prev,
            [planId]: result.premium
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling add-on:', error);
      Alert.alert('Error', 'Failed to update premium calculation. Please try again.');
    } finally {
      // Hide loading
      setLoadingAddOns(prev => ({
        ...prev,
        [`${planId}-${addOnId}`]: false
      }));
    }
  };

  const openDropdownModal = (planId, addOn) => {
    setCurrentPlanId(planId);
    setCurrentDropdown(addOn);
    setModalVisible(true);
  };

  const selectDropdownOption = async (planId, addOnId, option) => {
    // Show loading for this dropdown
    setLoadingDropdowns(prev => ({
      ...prev,
      [`${planId}-${addOnId}`]: true
    }));

    try {
      // Make API call to calculate premium with selected dropdown option
      const result = await calculatePremiumWithAddOns(planId, addOnId, true, option);

      if (result) {
        if (result.success) {
          // Note: State is already updated in calculatePremiumWithAddOns

          setModalVisible(false);
        } else {
          // If using local calculation, still update state
          setDropdownValues(prev => ({
            ...prev,
            [planId]: {
              ...prev[planId],
              [addOnId]: option
            }
          }));

          // Ensure the add-on is selected
          setSelectedAddOns(prev => {
            const planAddOns = new Set(prev[planId] || []);
            if (!planAddOns.has(addOnId)) {
              planAddOns.add(addOnId);
            }
            return { ...prev, [planId]: planAddOns };
          });

          // Update calculated premium for this plan
          setCalculatedPremiums(prev => ({
            ...prev,
            [planId]: result.premium
          }));

          setModalVisible(false);
        }
      }
    } catch (error) {
      console.error('Error selecting dropdown option:', error);
      Alert.alert('Error', 'Failed to update premium calculation. Please try again.');
    } finally {
      // Hide loading
      setLoadingDropdowns(prev => ({
        ...prev,
        [`${planId}-${addOnId}`]: false
      }));
    }
  };

  const getLogoUrl = (providerName) => {
    if (!providerName) return null;

    const lowerName = providerName.toLowerCase().trim();

    if (lowerName.includes('care')) {
      return "https://lmvpay-images.s3.ap-south-1.amazonaws.com/care_health.png";
    }

    if (lowerName.includes('reliance')) {
      return "https://lmvpay-images.s3.ap-south-1.amazonaws.com/rgen_logo.png";
    }

    return null;
  };

  const togglePlanExpansion = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const getSelectedAddOnDetails = (planId) => {
    const selectedIds = Array.from(selectedAddOns[planId] || []);
    const plan = plans.find(p => p.id === planId);
    const planDropdownValues = dropdownValues[planId] || {};

    if (!plan) return [];

    return plan.add_ons
      .filter(addOn => selectedIds.includes(addOn.id))
      .map(addOn => {
        if (addOn.type === 'checkbox') {
          return {
            id: addOn.id,
            name: addOn.name,
            price: addOn.price,
            type: 'checkbox'
          };
        } else if (addOn.type === 'dropdown') {
          const selectedOption = planDropdownValues[addOn.id];
          return {
            id: addOn.id,
            name: `${addOn.name}: ${selectedOption?.name || 'Not selected'}`,
            price: selectedOption?.price || 0,
            type: 'dropdown',
            option: selectedOption
          };
        }
        return null;
      })
      .filter(Boolean);
  };

const handleSelectPlan = async (plan) => {
  setSubmittingPlan(plan.id);

  try {
    // Get selected add-ons details for this plan
    const selectedAddOnsList = getSelectedAddOnDetails(plan.id);
    const totalPremium = calculatedPremiums[plan.id] || calculatePremiumLocally(
      plan,
      selectedAddOns[plan.id] || new Set(),
      dropdownValues[plan.id] || {}
    );

    // Prepare plan data with all necessary details
    const planData = {
      // Basic plan info
      id: plan.id,
      name: plan.name,
      company_name: plan.company_name,
      code: plan.code,
      term: plan.term,
      coverage_amount: plan.coverage_amount,
      
      // Premium info
      basePremium: plan.basePremium,
      basePremiumWithGST: plan.basePremiumWithGST,
      finalPremium: totalPremium,
      premiumWithGST: plan.premiumWithGST || plan.premium,
      
      // API data
      apiData: plan.apiData,
       logoUrl: plan.logoUrl,
      // Selected add-ons
      selectedAddOns: selectedAddOnsList,
      dropdownValues: dropdownValues[plan.id] || {},
      
      // User's original payload
      userPayload: payloadC,
      
      // Add-on selection state
      addOnsState: {
        selectedIds: Array.from(selectedAddOns[plan.id] || []),
        dropdownSelections: dropdownValues[plan.id] || {}
      }
    };
console.log(planData,"plan data")
    router.push({
      pathname: '/products/insurance/health/proposal',
      params: {
        planData: JSON.stringify(planData),
        formId: formId || '',
        originalPayload: JSON.stringify(payloadC || {})
      }
    });

  } catch (error) {
    console.error('Error selecting plan:', error);
    Alert.alert('Error', error.message || 'Failed to select plan');
    setSubmittingPlan(null);
  }
};

  const formatCurrency = (amount) => {
    // amount is in paise, convert to rupees
    const rupees = amount / 100;

    // Handle negative amounts (discounts)
    if (rupees < 0) {
      return `-₹${Math.abs(rupees).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }

    return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const formatCoverage = (amount) => {
    // amount is in paise, convert to lakhs
    const lakhs = amount / 100000;
    return `₹${lakhs.toLocaleString('en-IN')} Lakhs`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading health plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (plans.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={60} color="#FF3B30" />
          <Text style={styles.errorText}>No Health Plans Available</Text>
          <Text style={styles.errorSubtext}>
            We couldn't find any insurance plans matching your criteria.
          </Text>
          <TouchableOpacity
            style={styles.backButtonFull}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const DropdownModal = () => {
    const isLoading = currentDropdown ? loadingDropdowns[`${currentPlanId}-${currentDropdown.id}`] : false;
    const currentSelectedOption = currentDropdown ? (dropdownValues[currentPlanId]?.[currentDropdown.id] || null) : null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentDropdown?.name}</Text>
              <TouchableOpacity
                onPress={() => !isLoading && setModalVisible(false)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <MaterialIcons name="close" size={24} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>{currentDropdown?.description}</Text>

            {isLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.modalLoadingText}>Calculating premium...</Text>
              </View>
            ) : (
              <FlatList
                data={[
                  // Add a "None" option first
                  ...(currentDropdown?.options || [])
                ]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      item.id === 'none' && styles.noneOption,
                      item.id === currentSelectedOption?.id && styles.selectedOption
                    ]}
                    onPress={() => {
                      if (item.id === 'none') {
                        // Remove the dropdown selection
                        removeDropdownOption(currentPlanId, currentDropdown.id);
                        setModalVisible(false);
                      } else {
                        // Select the dropdown option
                        selectDropdownOption(currentPlanId, currentDropdown.id, item);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <View style={styles.optionContent}>
                      <Text style={[
                        styles.optionName,
                        item.id === 'none' && styles.noneOptionText,
                        item.id === currentSelectedOption?.id && styles.selectedOptionText
                      ]}>
                        {item.name}
                      </Text>
                      {item.price && (
                        <Text style={[
                          styles.optionPrice,
                          item.price < 0 && styles.discountPrice
                        ]}>

                        </Text>
                      )}
                    </View>
                    {item.id === currentSelectedOption?.id ? (
                      <MaterialIcons name="check" size={24} color="#007AFF" />
                    ) : (
                      <MaterialIcons name="chevron-right" size={24} color="#666" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const PlanCard = ({ plan, index }) => {
    const isExpanded = expandedPlans[plan.id];
    const totalPremium = calculatedPremiums[plan.id] || calculatePremiumLocally(
      plan,
      selectedAddOns[plan.id] || new Set(),
      dropdownValues[plan.id] || {}
    );
    const hasGST = plan.premiumWithGST && plan.premiumWithGST !== plan.premium;
    const selectedAddOnsCount = getSelectedAddOnDetails(plan.id).length;

    const renderAddOnItem = (addOn) => {
      const isMandatory = addOn.mandatory;
      const isSelected = isMandatory ? true : (selectedAddOns[plan.id] || new Set()).has(addOn.id);
      const isDropdown = addOn.type === 'dropdown';
      const selectedOption = isDropdown ? (dropdownValues[plan.id]?.[addOn.id] || null) : null;
      const isDiscount = isDropdown ? (selectedOption?.price < 0 || false) : (addOn.price < 0 || false);
      const isLoading = loadingAddOns[`${plan.id}-${addOn.id}`] || loadingDropdowns[`${plan.id}-${addOn.id}`];

      if (isDropdown) {
        return (
          <TouchableOpacity
            key={addOn.id}
            style={[
              styles.addOnItem,
              isSelected && styles.addOnItemSelected,
              isSelected && isDiscount && styles.discountItemSelected,
              isLoading && styles.addOnItemLoading,
              isMandatory && styles.mandatoryAddOn,
            ]}
            onPress={() => {
              if (!isLoading && !isMandatory) {
                if (isSelected) {
                  // If already selected, show confirmation to remove
                  Alert.alert(
                    'Remove Add-on',
                    `Do you want to remove ${addOn.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', onPress: () => removeDropdownOption(plan.id, addOn.id) }
                    ]
                  );
                } else {
                  // If not selected, open dropdown modal
                  openDropdownModal(plan.id, addOn);
                }
              }
            }}
            disabled={isLoading || isMandatory}
          >
            <View style={styles.addOnLeft}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#007AFF" style={styles.addOnLoader} />
              ) : (
                <MaterialIcons
                  name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                  size={24}
                  color={isSelected ? (isDiscount ? '#10B981' : isMandatory ? '#666' : '#007AFF') : '#ccc'}
                />
              )}
              <View style={styles.addOnContent}>
                <View style={styles.addOnHeaderRow}>
                  <Text style={[styles.addOnName, isMandatory && styles.mandatoryText]}>
                    {addOn.name}
                  </Text>
                  {isMandatory && (
                    <View style={styles.mandatoryBadge}>
                      <Text style={styles.mandatoryBadgeText}>Mandatory</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addOnDescription}>
                  {addOn.description}
                </Text>
                {selectedOption && (
                  <Text style={styles.selectedOption}>
                    Selected: {selectedOption.name}
                  </Text>
                )}
                {isMandatory && (
                  <Text style={styles.mandatoryNote}>
                    This add-on is included by default
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.addOnRight}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <>
                  <Text style={[
                    styles.addOnPrice,
                    isDiscount && styles.discountPrice,
                    isSelected && isDiscount && styles.discountPriceSelected,
                    isMandatory && styles.mandatoryPrice
                  ]}>

                  </Text>
                  {!isMandatory && (
                    <MaterialIcons
                      name={isSelected ? 'close' : 'arrow-drop-down'}
                      size={24}
                      color={isSelected ? '#DC2626' : '#666'}
                    />
                  )}
                </>
              )}
            </View>
          </TouchableOpacity>
        );
      }

      // Regular checkbox add-on
      return (
        <TouchableOpacity
          key={addOn.id}
          style={[
            styles.addOnItem,
            isSelected && styles.addOnItemSelected,
            isSelected && isDiscount && styles.discountItemSelected,
            isLoading && styles.addOnItemLoading,
            isMandatory && styles.mandatoryAddOn,
          ]}
          onPress={() => !isLoading && !isMandatory && toggleAddOn(plan.id, addOn.id)}
          disabled={isLoading || isMandatory}
        >
          <View style={styles.addOnLeft}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#007AFF" style={styles.addOnLoader} />
            ) : (
              <MaterialIcons
                name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={isSelected ? (isDiscount ? '#10B981' : isMandatory ? '#666' : '#007AFF') : '#ccc'}
              />
            )}
            <View style={styles.addOnContent}>
              <View style={styles.addOnHeaderRow}>
                <Text style={[styles.addOnName, isMandatory && styles.mandatoryText]}>
                  {addOn.name}
                </Text>
                {isMandatory && (
                  <View style={styles.mandatoryBadge}>
                    <Text style={styles.mandatoryBadgeText}>Mandatory</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addOnDescription}>
                {addOn.description}
              </Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text style={[
              styles.addOnPrice,
              isDiscount && styles.discountPrice,
              isSelected && isDiscount && styles.discountPriceSelected,
              isMandatory && styles.mandatoryPrice
            ]}>

            </Text>
          )}
        </TouchableOpacity>
      );
    };
    const removeDropdownOption = async (planId, addOnId) => {
      // Show loading for this dropdown
      setLoadingDropdowns(prev => ({
        ...prev,
        [`${planId}-${addOnId}`]: true
      }));

      try {
        // Make API call to calculate premium without this dropdown option
        const result = await calculatePremiumWithAddOns(planId, addOnId, false, null);

        if (result) {
          if (result.success) {
            // Note: State is already updated in calculatePremiumWithAddOns
            console.log('Dropdown option removed successfully');
          } else {
            // If using local calculation, still update state
            setDropdownValues(prev => ({
              ...prev,
              [planId]: {
                ...prev[planId],
                [addOnId]: null
              }
            }));

            // Remove the add-on from selected
            setSelectedAddOns(prev => {
              const planAddOns = new Set(prev[planId] || []);
              planAddOns.delete(addOnId);
              return { ...prev, [planId]: planAddOns };
            });

            // Update calculated premium for this plan
            setCalculatedPremiums(prev => ({
              ...prev,
              [planId]: result.premium
            }));
          }
        }
      } catch (error) {
        console.error('Error removing dropdown option:', error);
        Alert.alert('Error', 'Failed to update premium calculation. Please try again.');
      } finally {
        // Hide loading
        setLoadingDropdowns(prev => ({
          ...prev,
          [`${planId}-${addOnId}`]: false
        }));
      }
    };

    return (
      <View style={styles.planCard}>
        <View style={styles.cardHeader}>
          <View style={styles.planTitleRow}>
            {plan.logoUrl ? (
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: plan.logoUrl }}
                  style={styles.providerLogo}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={[
                styles.badge,
                { backgroundColor: index === 0 ? '#1A365D' : '#666' }
              ]}>
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
              </View>
            )}
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.companyName}>{plan.company_name}</Text>
              {plan.code && (
                <Text style={styles.planCode}>Plan Code: {plan.code}</Text>
              )}
            </View>
          </View>
          {index === 0 && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>BEST VALUE</Text>
            </View>
          )}
        </View>

        <View style={styles.premiumSection}>
          <View>
            <Text style={styles.premiumLabel}>Annual Premium</Text>
            <View style={styles.premiumRow}>
              <Text style={styles.premiumAmount}>
                {formatCurrency(totalPremium)}
              </Text>
              <Text style={styles.premiumUnit}>per year</Text>
            </View>
            <Text style={styles.termText}>Term: {plan.term} Year{plan.term !== '1' ? 's' : ''}</Text>
            {selectedAddOnsCount > 0 && (
              <Text style={styles.addOnsCount}>
                +{selectedAddOnsCount} add-on(s) included
              </Text>
            )}
          </View>
          <View style={styles.coverageBox}>
            <Text style={styles.coverageLabel}>Sum Insured</Text>
            <Text style={styles.coverageAmount}>
              {formatCoverage(plan.coverage_amount)}
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
            {isExpanded ? 'Show less' : `View details & add-ons (${plan.add_ons.length} available)`}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.addOnsSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="add-circle" size={20} color="#FF9800" />
                <Text style={styles.sectionTitle}>
                  Plan-specific Add-ons ({selectedAddOnsCount} selected)
                </Text>
              </View>
              {plan.add_ons.map(renderAddOnItem)}
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
            <Text style={styles.totalNote}>
              {selectedAddOnsCount > 0 ? `Including ${selectedAddOnsCount} add-on(s)` : 'Base premium only'}
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
            <Text style={styles.headerTitle}>Health Insurance Quotes</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.plansList}>
            {plans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
      <DropdownModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mandatoryAddOn: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.8,
  },
  mandatoryText: {
    color: '#666',
  },
  mandatoryBadge: {
    backgroundColor: '#757575',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  mandatoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  mandatoryNote: {
    fontSize: 11,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 2,
  },
  mandatoryPrice: {
    color: '#666',
  },
  noneOption: {
    backgroundColor: '#FFF5F5',
    borderBottomWidth: 2,
    borderBottomColor: '#FEE2E2',
  },
  noneOptionText: {
    color: '#DC2626',
    fontStyle: 'italic',
  },
  selectedOption: {
    backgroundColor: '#F0F9FF',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  addOnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  providerLogo: {
    width: 50,
    height: 50,
  },
  errorText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  backButtonFull: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
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
    marginBottom: 2,
  },
  planCode: {
    fontSize: 12,
    color: '#999',
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
    color: '#0066FF',
    marginRight: 8,
  },
  premiumUnit: {
    fontSize: 14,
    color: '#666',
  },
  termText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  addOnsCount: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    fontStyle: 'italic',
  },
  coverageBox: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  coverageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  coverageAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0066FF',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1A365D',
    borderRadius: 8,
  },
  expandText: {
    color: '#1A365D',
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
  addOnsSection: {
    marginBottom: 20,
  },
  addOnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addOnItemLoading: {
    opacity: 0.7,
  },
  addOnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addOnLoader: {
    marginRight: 8,
  },
  addOnRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addOnItemSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1A365D',
  },
  discountItemSelected: {
    backgroundColor: '#F0FFF4',
    borderColor: '#10B981',
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
    marginBottom: 4,
  },
  selectedOption: {
    fontSize: 12,
    color: '#1A365D',
    fontStyle: 'italic',
  },
  addOnPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A365D',
    marginRight: 8,
  },
  discountPrice: {
    color: '#DC2626',
  },
  discountPriceSelected: {
    color: '#10B981',
    fontWeight: '700',
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
    color: '#000000',
  },
  totalNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectButton: {
    backgroundColor: '#1A365D',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  modalLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  optionPrice: {
    fontSize: 14,
    color: '#1A365D',
  },
});