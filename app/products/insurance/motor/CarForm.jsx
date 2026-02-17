import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, StatusBar, Modal, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons, Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import LoadingLottie from '../../../../assets/animations/loading.json'
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router'

// Dropdown Modal Component
const DropdownModal = ({ visible, onClose, title, options, selectedValue, onSelect, field, loading }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
        if (!searchQuery.trim()) return options;

        const query = searchQuery.toLowerCase().trim();
        return options.filter(item => {
            if (field === 'rtoLocation' && typeof item === 'object') {
                // For RTO location objects
                const locationString = `${item.REGISTERED_CITY_NAME} - ${item.registered_state_name} (${item["RTO Code"]})`.toLowerCase();
                return locationString.includes(query);
            } else if (field === 'variant' && typeof item === 'object') {
                // For variant objects
                return item.variant.toLowerCase().includes(query) ||
                    (item.cc && item.cc.toString().includes(query));
            } else if (typeof item === 'string') {
                // For string options
                return item.toLowerCase().includes(query);
            }
            return true;
        });
    }, [options, searchQuery, field]);

    // Reset search when modal closes
    useEffect(() => {
        if (!visible) {
            setSearchQuery('');
        }
    }, [visible]);

    // Function to format RTO location display
    const formatRTOLocation = (item) => {
        return `${item.REGISTERED_CITY_NAME} - ${item.registered_state_name} (${item["RTO Code"]})`;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <Feather name="x" size={24} color="#103d69" />
                        </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View style={styles.modalSearchContainer}>
                        <Feather name="search" size={20} color="#999" style={styles.modalSearchIcon} />
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder={`Search ${title.toLowerCase()}...`}
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Feather name="x" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {loading ? (
                        <View style={styles.modalLoadingContainer}>
                            <ActivityIndicator size="large" color="#103d69" />
                            <Text style={styles.modalLoadingText}>Loading...</Text>
                        </View>
                    ) : (
                        <>
                            {filteredOptions.length === 0 ? (
                                <View style={styles.modalEmptyContainer}>
                                    <Feather name="search" size={48} color="#ccc" />
                                    <Text style={styles.modalEmptyText}>No results found</Text>
                                    <Text style={styles.modalEmptySubText}>Try different keywords</Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={filteredOptions}
                                    keyExtractor={(item, index) => {
                                        if (field === 'variant') {
                                            return `${item.variant}-${index}`;
                                        } else if (field === 'rtoLocation') {
                                            return `${item["RTO Code"]}-${index}`;
                                        }
                                        return `${item}-${index}`;
                                    }}
                                    showsVerticalScrollIndicator={true}
                                    contentContainerStyle={styles.modalList}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({ item }) => {
                                        let isSelected = false;
                                        let displayText = '';

                                        if (field === 'variant') {
                                            isSelected = selectedValue === item.variant;
                                            displayText = item.variant;
                                        } else if (field === 'rtoLocation') {
                                            isSelected = selectedValue === formatRTOLocation(item);
                                            displayText = formatRTOLocation(item);
                                        } else {
                                            isSelected = selectedValue === item;
                                            displayText = item;
                                        }

                                        return (
                                            <TouchableOpacity
                                                style={[
                                                    styles.modalItem,
                                                    isSelected && styles.modalItemSelected
                                                ]}
                                                onPress={() => {
                                                    if (field === 'variant') {
                                                        onSelect('variant', item.variant);
                                                    } else if (field === 'rtoLocation') {
                                                        onSelect('rtoLocation', formatRTOLocation(item));
                                                    } else {
                                                        onSelect(field, item);
                                                    }
                                                    onClose();
                                                }}
                                            >
                                                <View style={styles.modalItemContent}>
                                                    {field === 'variant' ? (
                                                        <>
                                                            <Text style={[
                                                                styles.modalItemText,
                                                                isSelected && styles.modalItemTextSelected
                                                            ]}>
                                                                {item.variant}
                                                            </Text>
                                                            {item.cc && (
                                                                <Text style={[
                                                                    styles.modalItemSubText,
                                                                    isSelected && styles.modalItemTextSelected
                                                                ]}>
                                                                    {item.cc} cc
                                                                </Text>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Text style={[
                                                            styles.modalItemText,
                                                            isSelected && styles.modalItemTextSelected
                                                        ]}>
                                                            {displayText}
                                                        </Text>
                                                    )}
                                                </View>
                                                {isSelected && (
                                                    <Feather name="check" size={20} color="white" />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    }}
                                    ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                                />
                            )}
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const CarForm = ({ navigation }) => {
    const router = useRouter();
    // Navigation state
    const [currentStep, setCurrentStep] = useState(1)
    const [registrationNumber, setRegistrationNumber] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [flowType, setFlowType] = useState(null) // 'with-number', 'without-number', 'new-vehicle'
    const [rtoLocations, setRtoLocations] = useState([]);
    const [loadingRtoLocations, setLoadingRtoLocations] = useState(false);

    // Vehicle master data from API
    const [vehicleMasterData, setVehicleMasterData] = useState([])
    const [loadingMasterData, setLoadingMasterData] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    // Date pickers
    const [showRegistrationDatePicker, setShowRegistrationDatePicker] = useState(false)
    const [showManufacturingDatePicker, setShowManufacturingDatePicker] = useState(false)
    const [showPreviousExpiryDatePicker, setShowPreviousExpiryDatePicker] = useState(false)

    // Form validation
    const [touchedFields, setTouchedFields] = useState({})
    const [errors, setErrors] = useState({})

    // Modal states
    const [modalVisible, setModalVisible] = useState(false)
    const [modalField, setModalField] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

    // Derived data from vehicle master
    const [uniqueMakes, setUniqueMakes] = useState([])
    const [modelsForMake, setModelsForMake] = useState([])
    const [variantsForModel, setVariantsForModel] = useState([])

    // Loading states for dropdowns
    const [loadingMakes, setLoadingMakes] = useState(false)
    const [loadingModels, setLoadingModels] = useState(false)
    const [loadingVariants, setLoadingVariants] = useState(false)

    // Fuel types for dropdown
    const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']
    const policyTypeOptions = [
        'Comprehensive (Own damage + Third party)',
        'OD Only (Own damage only)',
        'TP Only (Third party only)'
    ];

    // Map to convert between display text and IDs
    const policyTypeMap = {
        'Comprehensive (Own damage + Third party)': 'comprehensive',
        'OD Only (Own damage only)': 'od',
        'TP Only (Third party only)': 'tp'
    };

    // Reverse map to get display text from ID
    const getPolicyTypeDisplay = (id) => {
        const map = {
            'comprehensive': 'Comprehensive (Own damage + Third party)',
            'od': 'OD Only (Own damage only)',
            'tp': 'TP Only (Third party only)'
        };
        return map[id] || id;
    };

    // NCB options for dropdown modal
    const ncbOptions = ['0%', '20%', '25%', '35%', '45%', '50%'];

    // Map to convert between display text and numeric values
    const ncbMap = {
        '0%': 0,
        '20%': 20,
        '25%': 25,
        '35%': 35,
        '45%': 45,
        '50%': 50
    };

    // Reverse map to get display text from numeric value
    const getNCBDisplay = (value) => {
        const map = {
            0: '0%',
            20: '20%',
            25: '25%',
            35: '35%',
            45: '45%',
            50: '50%'
        };
        return map[value] || `${value}%`;
    };

    // Owner types
    const ownerTypes = [
        { id: 'individual', name: 'Individual' },
        { id: 'company', name: 'Company' }
    ]

    // IDV options (percentage of ex-showroom price)
    const idvOptions = [80, 85, 90, 95, 100]

    // Form state
    const [formData, setFormData] = useState({
        // Vehicle Details
        make: '',
        model: '',
        variant: '',
        fuelType: '',
        cc: '',
        registrationNumber: '',
        registrationDate: '',
        manufacturingDate: '',
        ownerFullName: '',
        mobileNumber: '',
        pincode: '',
        rtoLocation: '',

        // Insurance Specific
        idv: '',
        idvPercentage: 90,
        ncb: 0,
        ncbDisplay: '', // Add this for display
        policyType: 'comprehensive',
        policyTypeDisplay: 'Comprehensive (Own damage + Third party)', // Add this for display
        ownerType: 'individual',

        // Previous Policy Details
        previousPolicy: false,
        previousPolicyNumber: '',
        previousPolicyExpiryDate: '',
        previousClaimCount: '0',
        previousInsurer: '',

        // New Vehicle Specific
        exShowroomPrice: '',
        invoiceDate: '',
    });

    // Fetch vehicle master data
    // Fetch vehicle master data and RTO locations in parallel
    const getCarVehicleMaster = async () => {
        setLoadingMasterData(true);
        setInitialLoading(true);
        setLoadingRtoLocations(true);

        try {
            // Use Promise.all to fetch both APIs simultaneously
            const [vehicleResponse, rtoResponse] = await Promise.all([
                axios.get(`https://zdjirmdglrclzpajybwr.supabase.co/storage/v1/object/public/car%20json/car_data_reformatted%20(1)%20(1).json`),
                axios.get(`https://lmv-web-staging.s3.ap-south-1.amazonaws.com/JSON/Vehicle/city+rto+master+data.json`)
            ]);

            // Process vehicle data
            if (vehicleResponse.data && Array.isArray(vehicleResponse.data)) {
                setVehicleMasterData(vehicleResponse.data);

                // Extract unique makes
                const makes = [...new Set(vehicleResponse.data.map(item => item.make))].sort();
                setUniqueMakes(makes);
            }

            // Process RTO data
            if (rtoResponse.data && Array.isArray(rtoResponse.data)) {
                setRtoLocations(rtoResponse.data);
            }

        } catch (error) {
            console.error('Error fetching data:', error);

            // More specific error handling
            if (error.code === 'ECONNABORTED') {
                Alert.alert('Error', 'Request timeout. Please check your internet connection.');
            } else if (error.response) {
                // The request was made and the server responded with a status code outside 2xx
                Alert.alert('Error', `Server error: ${error.response.status}`);
            } else if (error.request) {
                // The request was made but no response was received
                Alert.alert('Error', 'No response from server. Please check your internet connection.');
            } else {
                // Something happened in setting up the request
                Alert.alert('Error', 'Failed to load data. Please try again.');
            }
        } finally {
            setLoadingMasterData(false);
            setLoadingRtoLocations(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        getCarVehicleMaster()
    }, [])

    // Update models when make changes
    useEffect(() => {
        const loadModels = async () => {
            if (formData.make && vehicleMasterData.length > 0) {
                setLoadingModels(true)
                // Simulate slight delay for better UX
                await new Promise(resolve => setTimeout(resolve, 300))

                const models = [...new Set(
                    vehicleMasterData
                        .filter(item => item.make === formData.make)
                        .map(item => item.model)
                )].sort()
                setModelsForMake(models)
                setLoadingModels(false)

                // Clear model and variant if current selection not valid
                if (formData.model && !models.includes(formData.model)) {
                    handleInputChange('model', '')
                    handleInputChange('variant', '')
                    handleInputChange('cc', '')
                }
            } else {
                setModelsForMake([])
            }
        }

        loadModels()
    }, [formData.make, vehicleMasterData])

    // Update variants when model changes
    useEffect(() => {
        const loadVariants = async () => {
            if (formData.make && formData.model && vehicleMasterData.length > 0) {
                setLoadingVariants(true)
                // Simulate slight delay for better UX
                await new Promise(resolve => setTimeout(resolve, 300))

                const variants = vehicleMasterData
                    .filter(item => item.make === formData.make && item.model === formData.model)
                    .map(item => ({
                        variant: item.variant,
                        cc: item.cc
                    }))
                    .filter((item, index, self) =>
                        index === self.findIndex(t => t.variant === item.variant)
                    )
                    .sort((a, b) => a.variant.localeCompare(b.variant))

                setVariantsForModel(variants)
                setLoadingVariants(false)

                // Clear variant if current selection not valid
                if (formData.variant && !variants.some(v => v.variant === formData.variant)) {
                    handleInputChange('variant', '')
                    handleInputChange('cc', '')
                }
            } else {
                setVariantsForModel([])
            }
        }

        loadVariants()
    }, [formData.make, formData.model, vehicleMasterData])

    // Update CC when variant changes
    useEffect(() => {
        if (formData.make && formData.model && formData.variant && vehicleMasterData.length > 0) {
            const vehicle = vehicleMasterData.find(
                item => item.make === formData.make &&
                    item.model === formData.model &&
                    item.variant === formData.variant
            )
            if (vehicle) {
                // Only update CC if it's different from current value
                const ccValue = vehicle.cc?.toString() || '';
                if (formData.cc !== ccValue) {
                    handleInputChange('cc', ccValue);
                }
                // Also set fuel type if available and not already set
                if (!formData.fuelType && vehicle.fuelType) {
                    handleInputChange('fuelType', vehicle.fuelType);
                }

                // Validate variant after selection
                setTimeout(() => {
                    validateField('variant', formData.variant);
                }, 100);
            }
        }
    }, [formData.make, formData.model, formData.variant, vehicleMasterData]);

    // Mock data for registration number search
    const mockVehicleData = {
        'MH01AB1234': {
            make: 'ALFA ROMEO',
            model: '156',
            variant: 'STANDARD SUV',
            fuelType: 'PETROL',
            cc: '3179',
            registrationDate: '2022-05-15',
            manufacturingDate: '2022-03-10',
            ownerFullName: 'Rahul Sharma',
            mobileNumber: '9876543210',
            pincode: '400001',
            rtoLocation: 'Mumbai Central',
            previousPolicy: true,
            previousPolicyNumber: 'POL123456',
            previousPolicyExpiryDate: '2024-05-14',
            previousClaimCount: '0',
            previousInsurer: 'ICICI Lombard',
        },
        'DL02CD5678': {
            make: 'AC SIX',
            model: 'VINTAGE',
            variant: 'SIX ROYAL ROADSTAR HATCH',
            fuelType: 'PETROL',
            cc: '1995',
            registrationDate: '2023-01-20',
            manufacturingDate: '2022-12-05',
            ownerFullName: 'Priya Patel',
            mobileNumber: '8765432109',
            pincode: '110001',
            rtoLocation: 'New Delhi',
            previousPolicy: true,
            previousPolicyNumber: 'POL789012',
            previousPolicyExpiryDate: '2024-01-19',
            previousClaimCount: '1',
            previousInsurer: 'HDFC Ergo',
        },
        'KA03EF9012': {
            make: 'ALDER',
            model: 'VINTAGE',
            variant: 'SPORTS HATCH',
            fuelType: 'PETROL',
            cc: '1645',
            registrationDate: '2023-08-10',
            manufacturingDate: '2023-07-15',
            ownerFullName: 'Suresh Kumar',
            mobileNumber: '7654321098',
            pincode: '560001',
            rtoLocation: 'Bangalore',
        },
    }

    // Flow selection
    const selectFlow = (flow) => {
        setFlowType(flow)
        setCurrentStep(1)
        setFormData({
            make: '',
            model: '',
            variant: '',
            fuelType: '',
            cc: '',
            registrationNumber: '',
            registrationDate: '',
            manufacturingDate: '',
            ownerFullName: '',
            mobileNumber: '',
            pincode: '',
            rtoLocation: '',
            idv: '',
            idvPercentage: 90,
            ncb: 0,
            ncbDisplay: '',
            policyType: 'comprehensive',
            policyTypeDisplay: 'Comprehensive (Own damage + Third party)',
            ownerType: 'individual',
            previousPolicy: false,
            previousPolicyNumber: '',
            previousPolicyExpiryDate: '',
            previousClaimCount: '0',
            previousInsurer: '',
            exShowroomPrice: '',
            invoiceDate: '',
        })
        setErrors({})
        setTouchedFields({})
        closeModal()
    }

    const handleSearch = async () => {
        if (!registrationNumber.trim()) {
            Alert.alert('Error', 'Please enter registration number')
            return
        }

        setIsSearching(true)

        // Simulate API call with mock data
        setTimeout(() => {
            const mockData = mockVehicleData[registrationNumber.toUpperCase()]

            if (mockData) {
                setFormData({
                    ...formData,
                    ...mockData,
                    registrationNumber: registrationNumber.toUpperCase(),
                })
                setErrors({})
                setCurrentStep(2)
                Alert.alert('Success', 'Vehicle details fetched successfully!')
            } else {
                Alert.alert('Not Found', 'No vehicle found with this registration number')
            }

            setIsSearching(false)
        }, 1000)
    }

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: null })
        }
        // Also clear touched state for this field
        if (touchedFields[field]) {
            setTouchedFields({ ...touchedFields, [field]: false })
        }
    }

    const handleBlur = (field) => {
        setTouchedFields({ ...touchedFields, [field]: true })
        validateField(field, formData[field])
    }

    const validateField = (field, value) => {
        let error = null

        // Skip validation if field is empty and not required in current context
        if (!value || value.toString().trim() === '') {
            // Check if field is required based on flow type and conditions
            const isRequired = isFieldRequired(field)
            if (isRequired) {
                error = getFieldRequiredMessage(field)
            }
        } else {
            // Field has value, perform specific validations
            switch (field) {
                case 'mobileNumber':
                    if (!/^[6-9]\d{9}$/.test(value)) {
                        error = 'Enter valid 10-digit mobile number'
                    }
                    break
                case 'pincode':
                    if (!/^\d{6}$/.test(value)) {
                        error = 'Enter valid 6-digit pincode'
                    }
                    break
                case 'idv':
                case 'exShowroomPrice':
                    if (isNaN(value) || parseFloat(value) <= 0) {
                        error = 'Please enter a valid amount'
                    }
                    break
            }
        }

        setErrors(prev => ({ ...prev, [field]: error }))
        return !error
    }

    const isFieldRequired = (field) => {
        switch (field) {
            case 'make':
            case 'model':
            case 'variant':
            case 'fuelType':
            case 'rtoLocation':
            case 'ownerFullName':
                return true
            case 'registrationNumber':
                return flowType === 'with-number'
            case 'registrationDate':
            case 'manufacturingDate':
                return flowType !== 'new-vehicle' && flowType !== null
            case 'mobileNumber':
            case 'pincode':
                return true
            case 'idv':
                return true
            case 'exShowroomPrice':
                return flowType === 'new-vehicle'
            case 'policyType': // Add this
                return true
            case 'previousPolicyNumber':
            case 'previousInsurer':
            case 'previousPolicyExpiryDate':
                return formData.previousPolicy
            default:
                return false
        }
    }

    const getFieldRequiredMessage = (field) => {
        const fieldNames = {
            make: 'Make',
            model: 'Model',
            variant: 'Variant',
            fuelType: 'Fuel type',
            registrationNumber: 'Registration number',
            registrationDate: 'Registration date',
            manufacturingDate: 'Manufacturing date',
            ownerFullName: 'Owner name',
            mobileNumber: 'Mobile number',
            pincode: 'Pincode',
            rtoLocation: 'RTO location',
            idv: 'IDV amount',
            exShowroomPrice: 'Ex-showroom price',
            previousPolicyNumber: 'Previous policy number',
            previousInsurer: 'Previous insurer',
            previousPolicyExpiryDate: 'Previous policy expiry date',
        }
        return `${fieldNames[field] || field} is required`
    }

    const validateStep = (step) => {
        let fieldsToValidate = []

        switch (step) {
            case 1: // Vehicle Details
                if (flowType === 'with-number') {
                    fieldsToValidate = ['registrationNumber']
                } else {
                    fieldsToValidate = ['make', 'model', 'variant', 'fuelType']
                    if (flowType !== 'new-vehicle') {
                        fieldsToValidate.push('registrationDate', 'manufacturingDate')
                    }
                }
                break
            case 2: // Owner Details
                fieldsToValidate = ['ownerFullName', 'mobileNumber', 'pincode', 'rtoLocation']
                break
            case 3: // Insurance Details
                fieldsToValidate = ['idv']
                if (flowType !== 'new-vehicle') {
                    if (formData.previousPolicy) {
                        fieldsToValidate.push('previousPolicyNumber', 'previousPolicyExpiryDate', 'previousInsurer')
                    }
                }
                if (flowType === 'new-vehicle') {
                    fieldsToValidate.push('exShowroomPrice')
                }
                break
        }

        // Mark all fields as touched for validation
        const newTouchedFields = {}
        fieldsToValidate.forEach(field => {
            newTouchedFields[field] = true
        })
        setTouchedFields({ ...touchedFields, ...newTouchedFields })

        // Validate each field
        let isValid = true
        fieldsToValidate.forEach(field => {
            const isFieldValid = validateField(field, formData[field])
            if (!isFieldValid) {
                isValid = false
            }
        })

        return isValid
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        setCurrentStep(currentStep - 1)
    }

    const handleGetQuotes = () => {
        if (validateStep(3)) {
           router.push("/products/insurance/motor/Quotations")
            Alert.alert('Success', 'Proceeding to quotes...', [
                { text: 'OK', onPress: () => console.log('Final form data:', formData) }
            ])
        }
    }

    const onDateChange = (event, selectedDate, field) => {
        if (Platform.OS === 'android') {
            setShowRegistrationDatePicker(false)
            setShowManufacturingDatePicker(false)
            setShowPreviousExpiryDatePicker(false)
        }

        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]
            handleInputChange(field, formattedDate)
            // Validate immediately after date selection
            validateField(field, formattedDate)
        }
    }

    const showDatepicker = (field) => {
        closeModal()
        if (field === 'registrationDate') {
            setShowRegistrationDatePicker(true)
        } else if (field === 'manufacturingDate') {
            setShowManufacturingDatePicker(true)
        } else {
            setShowPreviousExpiryDatePicker(true)
        }
    }

    const calculateIDV = () => {
        if (formData.exShowroomPrice) {
            const price = parseFloat(formData.exShowroomPrice)
            const idv = price * (formData.idvPercentage / 100)
            handleInputChange('idv', idv.toFixed(0))
        }
    }

    useEffect(() => {
        if (formData.exShowroomPrice && formData.idvPercentage) {
            calculateIDV()
        }
    }, [formData.exShowroomPrice, formData.idvPercentage])

    const openModal = (field, title) => {
        setModalField(field)
        setModalTitle(title)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setModalField(null)
    }

    const selectDropdownOption = (field, value) => {
        if (field === 'ncbDisplay') {
            // Handle NCB selection
            const ncbValue = ncbMap[value];
            handleInputChange('ncb', ncbValue);
            handleInputChange('ncbDisplay', value);
            validateField('ncb', ncbValue);
        } else if (field === 'policyTypeDisplay') {
            // Handle Policy Type selection
            const policyTypeValue = policyTypeMap[value];
            handleInputChange('policyType', policyTypeValue);
            handleInputChange('policyTypeDisplay', value);
            validateField('policyType', policyTypeValue);
        } else {
            handleInputChange(field, value);
            // Don't validate immediately - let the useEffect handle CC updates first
            if (field !== 'variant') {
                validateField(field, value);
            }
        }
    };
    // Initialize display fields for dropdowns
    useEffect(() => {
        // Set policy type display
        if (formData.policyType) {
            const displayValue = getPolicyTypeDisplay(formData.policyType);
            if (formData.policyTypeDisplay !== displayValue) {
                handleInputChange('policyTypeDisplay', displayValue);
            }
        }

        // Set NCB display
        if (formData.ncb !== undefined && formData.ncb !== null) {
            const displayValue = getNCBDisplay(formData.ncb);
            if (formData.ncbDisplay !== displayValue) {
                handleInputChange('ncbDisplay', displayValue);
            }
        }
    }, [formData.policyType, formData.ncb]);

    const renderFormField = (label, field, placeholder, keyboardType = 'default', editable = true, icon = null, required = true) => {
        const isTouched = touchedFields[field]
        const error = errors[field]
        const showError = isTouched && error

        return (
            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    {icon && <Feather name={icon} size={16} color="#666" style={{ marginRight: 6 }} />}
                    <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>
                        {label} {required && <Text style={{ color: '#e74c3c' }}>*</Text>}
                    </Text>
                </View>
                <View style={[
                    styles.inputContainer,
                    showError && styles.inputContainerError,
                    !editable && styles.inputContainerDisabled
                ]}>
                    <TextInput
                        style={[
                            styles.input,
                            !editable && styles.inputDisabled
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor="#aaa"
                        value={formData[field]}
                        onChangeText={(value) => handleInputChange(field, value)}
                        onBlur={() => handleBlur(field)}
                        keyboardType={keyboardType}
                        editable={editable}
                    />
                </View>
                {showError && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Feather name="alert-circle" size={14} color="#e74c3c" />
                        <Text style={{ color: '#e74c3c', fontSize: 12, marginLeft: 4 }}>
                            {error}
                        </Text>
                    </View>
                )}
            </View>
        )
    }

    const renderDateField = (label, field, placeholder, icon, required = true) => {
        const isTouched = touchedFields[field]
        const error = errors[field]
        const showError = isTouched && error

        return (
            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Feather name={icon} size={16} color="#666" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>
                        {label} {required && <Text style={{ color: '#e74c3c' }}>*</Text>}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.datePickerButton,
                        showError && styles.inputContainerError
                    ]}
                    onPress={() => showDatepicker(field)}
                >
                    <Text style={[
                        styles.datePickerText,
                        !formData[field] && styles.datePickerPlaceholder
                    ]}>
                        {formData[field] || placeholder}
                    </Text>
                    <Feather name="calendar" size={20} color="#103d69" />
                </TouchableOpacity>
                {showError && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Feather name="alert-circle" size={14} color="#e74c3c" />
                        <Text style={{ color: '#e74c3c', fontSize: 12, marginLeft: 4 }}>
                            {error}
                        </Text>
                    </View>
                )}
            </View>
        )
    }

    const renderDropdownField = (label, field, placeholder, icon, options, required = true, loading = false) => {
        const isTouched = touchedFields[field];
        const error = errors[field];
        const showError = isTouched && error;

        let displayOptions = options;
        let modalOptions = options;
        let isLoading = loading;

        if (field === 'variant') {
            isLoading = loadingVariants;
            modalOptions = variantsForModel;
        } else if (field === 'model') {
            isLoading = loadingModels;
            modalOptions = modelsForMake;
        } else if (field === 'make') {
            isLoading = loadingMasterData;
            modalOptions = uniqueMakes;
        } else if (field === 'rtoLocation') {
            isLoading = loadingRtoLocations;
            modalOptions = rtoLocations;
            // For display in the button, we show the selected value directly
            // since we store the formatted string
        }

        // Check if field is disabled
        const isDisabled = isLoading ||
            (field === 'model' && !formData.make) ||
            (field === 'variant' && (!formData.make || !formData.model));

        return (
            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Feather name={icon} size={16} color="#666" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>
                        {label} {required && <Text style={{ color: '#e74c3c' }}>*</Text>}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.dropdownButton,
                        showError && styles.inputContainerError,
                        isDisabled && styles.inputContainerDisabled
                    ]}
                    onPress={() => !isLoading && openModal(field, `Select ${label}`)}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {isLoading ? (
                            <>
                                <ActivityIndicator size="small" color="#103d69" />
                                <Text style={[styles.dropdownButtonText, { marginLeft: 8, color: '#999' }]}>
                                    Loading...
                                </Text>
                            </>
                        ) : (
                            <Text style={[
                                styles.dropdownButtonText,
                                !formData[field] && styles.dropdownPlaceholder
                            ]}>
                                {formData[field] || placeholder}
                                {field === 'variant' && formData.cc && ` (${formData.cc} cc)`}
                            </Text>
                        )}
                    </View>
                    <Feather name="chevron-down" size={20} color="#103d69" />
                </TouchableOpacity>

                {showError && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Feather name="alert-circle" size={14} color="#e74c3c" />
                        <Text style={{ color: '#e74c3c', fontSize: 12, marginLeft: 4 }}>
                            {error}
                        </Text>
                    </View>
                )}

                <DropdownModal
                    visible={modalVisible && modalField === field}
                    onClose={closeModal}
                    title={modalTitle}
                    options={modalOptions}
                    selectedValue={formData[field]}
                    onSelect={selectDropdownOption}
                    field={field}
                    loading={isLoading}
                />
            </View>
        );
    };

    const renderCCField = () => {
        const isTouched = touchedFields['cc']
        const error = errors['cc']
        const showError = isTouched && error

        return (
            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Feather name="activity" size={16} color="#666" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>
                        Engine CC {formData.make && formData.model && formData.variant ? '' : <Text style={{ color: '#e74c3c' }}>*</Text>}
                    </Text>
                </View>
                <View style={[
                    styles.inputContainer,
                    showError && styles.inputContainerError,
                    (!formData.make || !formData.model || !formData.variant) && styles.inputContainerDisabled
                ]}>
                    <TextInput
                        style={[
                            styles.input,
                            (!formData.make || !formData.model || !formData.variant) && styles.inputDisabled
                        ]}
                        placeholder={formData.make && formData.model && formData.variant ? "CC will be auto-filled" : "Select make, model & variant first"}
                        placeholderTextColor="#aaa"
                        value={formData.cc}
                        onChangeText={(value) => handleInputChange('cc', value)}
                        onBlur={() => handleBlur('cc')}
                        keyboardType="numeric"
                        editable={!!(formData.make && formData.model && formData.variant)}
                    />
                </View>
                {showError && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Feather name="alert-circle" size={14} color="#e74c3c" />
                        <Text style={{ color: '#e74c3c', fontSize: 12, marginLeft: 4 }}>
                            {error}
                        </Text>
                    </View>
                )}
            </View>
        )
    }

    const renderStepIndicator = () => (
        <View style={styles.stepIndicatorContainer}>
            <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, currentStep >= 1 && styles.stepDotTextActive]}>1</Text>
            </View>
            <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, currentStep >= 2 && styles.stepDotTextActive]}>2</Text>
            </View>
            <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
            <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, currentStep >= 3 && styles.stepDotTextActive]}>3</Text>
            </View>
        </View>
    )

  const renderFlowSelection = () => (
    <View style={styles.flowContainer}>
       

        {initialLoading ? (
            
            <View style={styles.initialLoadingContainer}>
                <LottieView
                    source={require('../../../../assets/animations/loading.json')}
                    autoPlay
                    loop
                    style={styles.lottieAnimation}
                />
                <Text style={styles.initialLoadingText}>Loading vehicle data...</Text>
            </View>
        ) : (
            <>
                <TouchableOpacity
                    style={styles.flowCard}
                    onPress={() => selectFlow('with-number')}
                >
                    <View style={styles.flowIconContainer}>
                        <Ionicons name="car" size={32} color="#103d69" />
                    </View>
                    <View style={styles.flowContent}>
                        <Text style={styles.flowTitle}>Vehicle with Number</Text>
                        <Text style={styles.flowDescription}>
                            Enter registration number to auto-fill vehicle details
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#103d69" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.flowCard}
                    onPress={() => selectFlow('without-number')}
                >
                    <View style={styles.flowIconContainer}>
                        <Ionicons name="car-outline" size={32} color="#103d69" />
                    </View>
                    <View style={styles.flowContent}>
                        <Text style={styles.flowTitle}>Vehicle without Number</Text>
                        <Text style={styles.flowDescription}>
                            Manually enter vehicle details
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#103d69" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.flowCard}
                    onPress={() => selectFlow('new-vehicle')}
                >
                    <View style={styles.flowIconContainer}>
                        <Ionicons name="car-sport" size={32} color="#103d69" />
                    </View>
                    <View style={styles.flowContent}>
                        <Text style={styles.flowTitle}>New Vehicle</Text>
                        <Text style={styles.flowDescription}>
                            Insurance for brand new vehicles
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#103d69" />
                </TouchableOpacity>
            </>
        )}
    </View>
)

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Vehicle Details</Text>

            {flowType === 'with-number' ? (
                <>
                    <View style={styles.searchCard}>
                        <Text style={styles.label}>
                            Registration Number <Text style={{ color: '#e74c3c' }}>*</Text>
                        </Text>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchInputWrapper}>
                                <Feather name="search" size={18} color="#999" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="e.g., MH01AB1234"
                                    placeholderTextColor="#aaa"
                                    value={registrationNumber}
                                    onChangeText={setRegistrationNumber}
                                    autoCapitalize="characters"
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                                onPress={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <Text style={styles.searchButtonText}>Search</Text>
                                        <Ionicons name="arrow-forward" size={18} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.make && (
                        <>
                            <Text style={styles.fetchedInfoTitle}>Fetched Vehicle Details:</Text>
                            <View style={styles.fetchedInfoCard}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Make:</Text>
                                    <Text style={styles.infoValue}>{formData.make}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Model:</Text>
                                    <Text style={styles.infoValue}>{formData.model}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Variant:</Text>
                                    <Text style={styles.infoValue}>{formData.variant}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>CC:</Text>
                                    <Text style={styles.infoValue}>{formData.cc} cc</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Fuel Type:</Text>
                                    <Text style={styles.infoValue}>{formData.fuelType}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Reg Date:</Text>
                                    <Text style={styles.infoValue}>{formData.registrationDate}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Mfg Date:</Text>
                                    <Text style={styles.infoValue}>{formData.manufacturingDate}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </>
            ) : (
                <>
                    {renderDropdownField('Make', 'make', 'Select make', 'cpu', uniqueMakes, true)}

                    {formData.make && renderDropdownField('Model', 'model', 'Select model', 'smartphone', modelsForMake, true)}

                    {formData.model && renderDropdownField('Variant', 'variant', 'Select variant', 'layers', variantsForModel, true)}

                    {renderDropdownField('Fuel Type', 'fuelType', 'Select fuel type', 'droplet', fuelTypes, true)}

                    {renderCCField()}

                    {flowType !== 'new-vehicle' && (
                        <>
                            {renderDateField('Registration Date', 'registrationDate', 'Select registration date', 'calendar')}
                            {renderDateField('Manufacturing Date', 'manufacturingDate', 'Select manufacturing date', 'package')}
                        </>
                    )}
                </>
            )}

            <TouchableOpacity
                style={[
                    styles.nextButton,
                    (flowType === 'with-number' ? !formData.make : !formData.make || !formData.model || !formData.variant || !formData.fuelType) &&
                    styles.nextButtonDisabled
                ]}
                onPress={handleNext}
                disabled={flowType === 'with-number' ? !formData.make : !formData.make || !formData.model || !formData.variant || !formData.fuelType}
            >
                <Text style={styles.nextButtonText}>Next</Text>
                <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
        </View>
    )

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Owner Details</Text>

            {renderFormField('Owner Full Name', 'ownerFullName', 'Enter owner name', 'default', true, 'user')}
            {renderFormField('Mobile Number', 'mobileNumber', 'Enter 10-digit mobile', 'phone-pad', true, 'phone')}
            {renderFormField('Pincode', 'pincode', 'Enter 6-digit pincode', 'numeric', true, 'map-pin')}

            {/* RTO Location Dropdown with Search */}
            {renderDropdownField(
                'RTO Location',
                'rtoLocation',
                'Select RTO location',
                'map',
                rtoLocations,
                true,
                loadingRtoLocations
            )}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Feather name="arrow-left" size={20} color="#103d69" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Feather name="arrow-right" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Insurance Details</Text>

            {/* IDV Selection */}
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.label}>IDV (Insured Declared Value)</Text>
                {flowType === 'new-vehicle' ? (
                    <>
                        <View style={styles.idvInputRow}>
                            <View style={[styles.searchInputWrapper, { flex: 1, marginRight: 12 }]}>
                                <Feather name="dollar-sign" size={18} color="#999" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Ex-showroom price"
                                    keyboardType="numeric"
                                    value={formData.exShowroomPrice}
                                    onChangeText={(value) => handleInputChange('exShowroomPrice', value)}
                                    onBlur={() => handleBlur('exShowroomPrice')}
                                />
                            </View>
                            <View style={styles.idvPercentageContainer}>
                                <Text style={styles.idvPercentageText}>{formData.idvPercentage}%</Text>
                            </View>
                        </View>

                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderLabel}>IDV Percentage: {formData.idvPercentage}%</Text>
                            <View style={styles.percentageButtons}>
                                {idvOptions.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.percentageButton,
                                            formData.idvPercentage === option && styles.percentageButtonActive
                                        ]}
                                        onPress={() => handleInputChange('idvPercentage', option)}
                                    >
                                        <Text style={[
                                            styles.percentageButtonText,
                                            formData.idvPercentage === option && styles.percentageButtonTextActive
                                        ]}>
                                            {option}%
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                ) : (
                    renderFormField('IDV Amount', 'idv', 'Enter IDV amount', 'numeric', true, 'tag')
                )}
            </View>

            {/* NCB Selection as Dropdown */}
            {flowType !== 'new-vehicle' && (
                renderDropdownField(
                    'NCB (No Claim Bonus)',
                    'ncbDisplay', // We'll use a separate field for display
                    'Select NCB %',
                    'percent',
                    ncbOptions,
                    false,
                    false
                )
            )}

            {/* Policy Type as Dropdown */}
            {renderDropdownField(
                'Policy Type',
                'policyTypeDisplay', // We'll use a separate field for display
                'Select policy type',
                'shield',
                policyTypeOptions,
                true,
                false
            )}

            {/* Owner Type Selection (keep as is) */}
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.label}>Owner Type</Text>
                <View style={styles.ownerTypeContainer}>
                    {ownerTypes.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.ownerTypeButton,
                                formData.ownerType === type.id && styles.ownerTypeButtonActive
                            ]}
                            onPress={() => handleInputChange('ownerType', type.id)}
                        >
                            <Text style={[
                                styles.ownerTypeText,
                                formData.ownerType === type.id && styles.ownerTypeTextActive
                            ]}>
                                {type.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Previous Policy Details (only for non-new vehicles) */}
            {flowType !== 'new-vehicle' && (
                <>
                    <TouchableOpacity
                        style={styles.previousPolicyToggle}
                        onPress={() => handleInputChange('previousPolicy', !formData.previousPolicy)}
                    >
                        <View style={styles.checkbox}>
                            {formData.previousPolicy && <Feather name="check" size={16} color="#103d69" />}
                        </View>
                        <Text style={styles.previousPolicyText}>I have a previous policy</Text>
                    </TouchableOpacity>

                    {formData.previousPolicy && (
                        <View style={styles.previousPolicySection}>
                            {renderFormField('Previous Policy Number', 'previousPolicyNumber', 'Enter policy number', 'default', true, 'file-text')}
                            {renderDateField('Previous Policy Expiry', 'previousPolicyExpiryDate', 'Select expiry date', 'calendar')}

                            <Text style={styles.label}>Claims in last policy</Text>
                            <View style={styles.claimContainer}>
                                {['0', '1', '2', '3+'].map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.claimButton,
                                            formData.previousClaimCount === option && styles.claimButtonActive
                                        ]}
                                        onPress={() => handleInputChange('previousClaimCount', option)}
                                    >
                                        <Text style={[
                                            styles.claimButtonText,
                                            formData.previousClaimCount === option && styles.claimButtonTextActive
                                        ]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {renderFormField('Previous Insurer', 'previousInsurer', 'Enter insurer name', 'default', true, 'shield')}
                        </View>
                    )}
                </>
            )}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Feather name="arrow-left" size={20} color="#103d69" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.continueButton} onPress={handleGetQuotes}>
                    <Text style={styles.continueButtonText}>Get Quotes</Text>
                    <Feather name="arrow-right" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="light-content" backgroundColor="#0a2e4a" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={() => {
                        if (flowType && currentStep > 1) {
                            setCurrentStep(currentStep - 1)
                        } else if (flowType) {
                            setFlowType(null)
                            closeModal()
                        } else {
                            navigation.goBack()
                        }
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Car Insurance</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                onScroll={closeModal}
                scrollEventThrottle={16}
            >
                {!flowType ? (
                    renderFlowSelection()
                ) : (
                    <>
                        {renderStepIndicator()}

                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </>
                )}
            </ScrollView>

            {/* Date Pickers */}
            {showRegistrationDatePicker && (
                <DateTimePicker
                    value={formData.registrationDate ? new Date(formData.registrationDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => onDateChange(event, date, 'registrationDate')}
                    maximumDate={new Date()}
                />
            )}

            {showManufacturingDatePicker && (
                <DateTimePicker
                    value={formData.manufacturingDate ? new Date(formData.manufacturingDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => onDateChange(event, date, 'manufacturingDate')}
                    maximumDate={new Date()}
                />
            )}

            {showPreviousExpiryDatePicker && (
                <DateTimePicker
                    value={formData.previousPolicyExpiryDate ? new Date(formData.previousPolicyExpiryDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => onDateChange(event, date, 'previousPolicyExpiryDate')}
                    minimumDate={new Date()}
                />
            )}
        </View>
    )
}

const styles = {
    header: {
        backgroundColor: '#103d69',
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    headerBackButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    stepDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepDotActive: {
        backgroundColor: '#103d69',
    },
    stepDotText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    stepDotTextActive: {
        color: 'white',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 8,
    },
    stepLineActive: {
        backgroundColor: '#103d69',
    },
    flowContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#103d69',
        marginBottom: 24,
    },
    flowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    flowIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#e6f0fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    flowContent: {
        flex: 1,
    },
    flowTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#103d69',
        marginBottom: 4,
    },
    flowDescription: {
        fontSize: 14,
        color: '#666',
    },
   initialLoadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
     lottieAnimation: {
        width: 200,
        height: 200,
    },
    initialLoadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    stepContainer: {
        padding: 16,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#103d69',
        marginBottom: 20,
    },
    searchCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#444',
        marginBottom: 8,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#f8f9fa',
    },
    modalSearchIcon: {
        marginRight: 10,
    },
    modalSearchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },
    modalEmptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalEmptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    modalEmptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginRight: 12,
        backgroundColor: 'white',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#103d69',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        minWidth: 110,
    },
    searchButtonDisabled: {
        backgroundColor: '#8a9cb0',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '700',
        marginRight: 6,
        fontSize: 15,
    },
    fetchedInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#103d69',
        marginBottom: 12,
    },
    fetchedInfoCard: {
        backgroundColor: '#f0f7ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#b8d1f0',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#d0e0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#103d69',
        fontWeight: '600',
    },
    inputContainer: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    inputContainerError: {
        borderColor: '#e74c3c',
        borderWidth: 1.5,
    },
    inputContainerDisabled: {
        backgroundColor: '#f8f9fa',
        borderColor: '#d0d0d0',
    },
    input: {
        fontSize: 15,
        color: '#333',
        padding: 0,
    },
    inputDisabled: {
        color: '#666',
    },
    datePickerButton: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    datePickerText: {
        fontSize: 15,
        color: '#333',
    },
    datePickerPlaceholder: {
        color: '#aaa',
    },
    dropdownButton: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownButtonText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    dropdownPlaceholder: {
        color: '#aaa',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#103d69',
        backgroundColor: 'white',
        flex: 0.3,
    },
    backButtonText: {
        color: '#103d69',
        fontWeight: '600',
        marginLeft: 8,
    },
    nextButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#103d69',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginLeft: 12,
        shadowColor: '#103d69',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nextButtonDisabled: {
        backgroundColor: '#8a9cb0',
        opacity: 0.6,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
    idvInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    idvPercentageContainer: {
        width: 70,
        height: 50,
        backgroundColor: '#e6f0fa',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#103d69',
    },
    idvPercentageText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#103d69',
    },
    sliderContainer: {
        marginTop: 8,
    },
    sliderLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    percentageButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    percentageButton: {
        width: '18%',
        margin: '1%',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#103d69',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    percentageButtonActive: {
        backgroundColor: '#103d69',
    },
    percentageButtonText: {
        color: '#103d69',
        fontWeight: '600',
        fontSize: 14,
    },
    percentageButtonTextActive: {
        color: 'white',
    },
    idvInfoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f0fa',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    idvInfoText: {
        marginLeft: 8,
        color: '#103d69',
        fontWeight: '600',
        fontSize: 14,
    },
    ncbContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    ncbButton: {
        width: '18%',
        margin: '1%',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#103d69',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    ncbButtonActive: {
        backgroundColor: '#103d69',
    },
    ncbButtonText: {
        color: '#103d69',
        fontWeight: '600',
        fontSize: 14,
    },
    ncbButtonTextActive: {
        color: 'white',
    },
    policyTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    policyTypeCardActive: {
        backgroundColor: '#103d69',
        borderColor: '#103d69',
    },
    policyTypeContent: {
        flex: 1,
    },
    policyTypeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#103d69',
        marginBottom: 4,
    },
    policyTypeDescription: {
        fontSize: 13,
        color: '#666',
    },
    policyTypeTextActive: {
        color: 'white',
    },
    ownerTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    ownerTypeButton: {
        width: '48%',
        margin: '1%',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#103d69',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    ownerTypeButtonActive: {
        backgroundColor: '#103d69',
    },
    ownerTypeText: {
        color: '#103d69',
        fontWeight: '600',
        fontSize: 14,
    },
    ownerTypeTextActive: {
        color: 'white',
    },
    previousPolicyToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#103d69',
        borderRadius: 6,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previousPolicyText: {
        fontSize: 16,
        color: '#103d69',
        fontWeight: '600',
    },
    previousPolicySection: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
    },
    claimContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    claimButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#103d69',
        marginRight: 8,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    claimButtonActive: {
        backgroundColor: '#103d69',
    },
    claimButtonText: {
        color: '#103d69',
        fontWeight: '600',
    },
    claimButtonTextActive: {
        color: 'white',
    },
    continueButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#103d69',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginLeft: 12,
        shadowColor: '#103d69',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        minHeight: '40%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#103d69',
    },
    modalCloseButton: {
        padding: 4,
    },
    modalList: {
        paddingVertical: 8,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    modalItemSelected: {
        backgroundColor: '#103d69',
    },
    modalItemContent: {
        flex: 1,
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalItemSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    modalItemTextSelected: {
        color: 'white',
    },
    modalSeparator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 20,
    },
    modalLoadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    modalLoadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
}

export default CarForm