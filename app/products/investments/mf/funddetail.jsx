import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Feather,
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    AntDesign,
    FontAwesome5,
    FontAwesome,
    Entypo,
} from '@expo/vector-icons';
import Svg, { Path, Line, Circle, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const FundDetail = () => {
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState('1Y');
    const [expandedSections, setExpandedSections] = useState({
        calculator: false,
        holdings: false,
        returns: false,
        expense: false,
        fundManagement: false,
        fundHouse: false,
        prosCons: false,
    });

    const fundData = {
        name: 'SBI Gold ETF Direct Plan Growth',
        category: 'Commodities · Gold',
        risk: 'Very High Risk',
        rating: 4,
        nav: 20.88,
        navDate: '21 Mar 2024',
        oneDayChange: '+7.88%',
        annualizedReturn: '13.15%',
        currentPrice: 100.28,
        changePercentage: 100.28,

        returns: {
            '1Y': 115.9,
            '3Y': 44.3,
            '5Y': 28.2,
            'All': 13.2
        },
        categoryAvg: {
            '1Y': 76.0,
            '3Y': 34.1,
            '5Y': 21.0,
            'All': '-'
        },
        rankings: {
            '1Y': 7,
            '3Y': 4,
            '5Y': 2,
            'All': '-'
        },

        expenseRatio: '0.24%',
        exitLoad: '1% if redeemed within 15 days',
        stampDuty: '0.005% (from July 1st, 2020)',
        taxImplication: 'If you redeem within two years, returns are taxed as per your Income Tax slab. If you redeem after two years, returns are taxed at 12.5%.',

        fundSize: '₹10,775 Cr',
        minSipAmount: '₹500',

        sipCalculator: {
            investment: 60000,
            returns: 80692,
            percentage: 34.49
        },

        holdings: [
            { name: 'Gold Bullion', percentage: '92.5%' },
            { name: 'Gold ETFs', percentage: '5.2%' },
            { name: 'Cash & Equivalents', percentage: '2.3%' }
        ],

        fundManager: {
            name: 'Rahul Sharma',
            role: 'Fund Manager - Gold & Commodities',
            experience: '8 years of experience'
        },

        fundHouse: 'SBI Mutual Fund',
        investmentObjective: 'The investment objective of the scheme is to provide returns that closely correspond to the returns provided by SBI Gold ETF.',
        
        pros: [
            'High liquidity',
            'Low expense ratio',
            'Direct gold exposure',
            'No wealth tax'
        ],
        cons: [
            'High risk',
            'No dividend option',
            'Market timing risk',
            'No capital guarantee'
        ]
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Graph data for different time periods
    const graphData = {
        '1M': [
            { date: '1 Jan', value: 95.5 },
            { date: '8 Jan', value: 96.2 },
            { date: '15 Jan', value: 97.8 },
            { date: '22 Jan', value: 98.5 },
            { date: '29 Jan', value: 100.28 }
        ],
        '6M': [
            { date: 'Jul', value: 85.0 },
            { date: 'Aug', value: 88.2 },
            { date: 'Sep', value: 91.5 },
            { date: 'Oct', value: 93.8 },
            { date: 'Nov', value: 96.4 },
            { date: 'Dec', value: 98.7 },
            { date: 'Jan', value: 100.28 }
        ],
        '1Y': [
            { date: 'Jan', value: 82.4 },
            { date: 'Mar', value: 85.6 },
            { date: 'May', value: 88.9 },
            { date: 'Jul', value: 91.2 },
            { date: 'Sep', value: 94.5 },
            { date: 'Nov', value: 97.8 },
            { date: 'Jan', value: 100.28 }
        ],
        '3Y': [
            { date: '2023', value: 75.4 },
            { date: '2024', value: 82.6 },
            { date: '2025', value: 91.8 },
            { date: '2026', value: 100.28 }
        ],
        '5Y': [
            { date: '2021', value: 65.2 },
            { date: '2022', value: 70.4 },
            { date: '2023', value: 75.6 },
            { date: '2024', value: 82.8 },
            { date: '2025', value: 91.0 },
            { date: '2026', value: 100.28 }
        ],
        'ALL': [
            { date: '2018', value: 50.0 },
            { date: '2019', value: 55.2 },
            { date: '2020', value: 60.4 },
            { date: '2021', value: 65.6 },
            { date: '2022', value: 70.8 },
            { date: '2023', value: 75.0 },
            { date: '2024', value: 82.2 },
            { date: '2025', value: 91.4 },
            { date: '2026', value: 100.28 }
        ]
    };

    const renderGraph = () => {
        const currentData = graphData[selectedPeriod] || graphData['1Y'];
        const chartWidth = width - 80;
        const chartHeight = 200;
        const padding = 20;
        const pointRadius = 4;

        // Calculate min and max values
        const values = currentData.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue;

        // Calculate Y scale factor
        const yScale = (chartHeight - 2 * padding) / (valueRange || 1);

        // Calculate X positions
        const xStep = chartWidth / (currentData.length - 1);

        // Generate path for the line
        let path = '';
        currentData.forEach((point, index) => {
            const x = padding + index * xStep;
            const y = chartHeight - padding - (point.value - minValue) * yScale;

            if (index === 0) {
                path = `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        });

        // Generate area path
        let areaPath = path;
        areaPath += ` L ${padding + (currentData.length - 1) * xStep} ${chartHeight - padding}`;
        areaPath += ` L ${padding} ${chartHeight - padding} Z`;

        return (
            <View style={styles.graphContainer}>
                <Svg width={chartWidth + 2 * padding} height={chartHeight + 40}>
                    <Defs>
                        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                            <Stop offset="100%" stopColor="#059669" stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Area under the line */}
                    <Path
                        d={areaPath}
                        fill="url(#gradient)"
                        opacity={0.8}
                    />

                    {/* Main line */}
                    <Path
                        d={path}
                        stroke="#059669"
                        strokeWidth={2.5}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {currentData.map((point, index) => {
                        const x = padding + index * xStep;
                        const y = chartHeight - padding - (point.value - minValue) * yScale;

                        return (
                            <G key={index}>
                                <Circle
                                    cx={x}
                                    cy={y}
                                    r={pointRadius}
                                    fill="#059669"
                                    stroke="#fff"
                                    strokeWidth={2}
                                />

                                {/* X-axis labels */}
                                <SvgText
                                    x={x}
                                    y={chartHeight + 20}
                                    fontSize="10"
                                    fill="#6B7280"
                                    textAnchor="middle"
                                >
                                    {point.date}
                                </SvgText>
                            </G>
                        );
                    })}

                    {/* Grid lines */}
                    {[0, 0.5, 1].map((tick) => {
                        const y = chartHeight - padding - (valueRange * tick) * yScale;
                        return (
                            <Line
                                key={tick}
                                x1={padding}
                                y1={y}
                                x2={chartWidth + padding}
                                y2={y}
                                stroke="#E5E7EB"
                                strokeWidth={1}
                                strokeDasharray="4 4"
                            />
                        );
                    })}

                    {/* Y-axis value labels */}
                    {[minValue, minValue + valueRange * 0.5, maxValue].map((value, index) => {
                        const y = chartHeight - padding - (value - minValue) * yScale;
                        return (
                            <SvgText
                                key={index}
                                x={0}
                                y={y - 5}
                                fontSize="10"
                                fill="#6B7280"
                            >
                                ₹{value.toFixed(1)}
                            </SvgText>
                        );
                    })}
                </Svg>

                {/* Performance indicator */}
                <View style={styles.performanceIndicator}>
                    <View style={styles.performanceBadge}>
                        <MaterialIcons name="trending-up" size={16} color="#059669" />
                        <Text style={styles.performanceText}>+{((maxValue - minValue) / minValue * 100).toFixed(1)}% growth</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderStars = (rating) => {
        return (
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign
                        key={star}
                        name={star <= rating ? 'star' : 'star'}
                        size={16}
                        color={star <= rating ? '#FFC107' : '#CBD5E1'}
                    />
                ))}
            </View>
        );
    };

    const renderPeriodTabs = () => {
        const periods = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];
        return (
            <View style={styles.periodTabs}>
                {periods.map((period) => (
                    <TouchableOpacity
                        key={period}
                        style={[
                            styles.periodTab,
                            selectedPeriod === period && styles.periodTabActive
                        ]}
                        onPress={() => setSelectedPeriod(period)}
                    >
                        <Text style={[
                            styles.periodTabText,
                            selectedPeriod === period && styles.periodTabTextActive
                        ]}>
                            {period}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderCollapsibleSection = (title, icon, sectionKey, content, badgeCount = null) => {
        const isExpanded = expandedSections[sectionKey];
        
        return (
            <View style={styles.sectionContainer}>
                <TouchableOpacity 
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(sectionKey)}
                    activeOpacity={0.7}
                >
                    <View style={styles.sectionHeaderContent}>
                        <View style={styles.sectionIcon}>
                            {icon}
                        </View>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        {badgeCount !== null && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{badgeCount}</Text>
                            </View>
                        )}
                    </View>
                    <MaterialIcons 
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                        size={24} 
                        color="#64748B" 
                    />
                </TouchableOpacity>
                
                {isExpanded && (
                    <View style={styles.sectionContent}>
                        {content}
                    </View>
                )}
            </View>
        );
    };

    const renderReturnsContent = () => (
        <View>
            {/* Returns Table */}
            <View style={styles.returnsTable}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Period</Text>
                    <Text style={styles.tableHeaderText}>Fund Returns</Text>
                    <Text style={styles.tableHeaderText}>Category Avg</Text>
                    <Text style={styles.tableHeaderText}>Rank</Text>
                </View>
                
                {['1Y', '3Y', '5Y', 'All'].map((period) => (
                    <View key={period} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{period}</Text>
                        <Text style={[styles.tableCell, styles.returnsValue]}>
                            {fundData.returns[period]}%
                        </Text>
                        <Text style={styles.tableCell}>
                            {fundData.categoryAvg[period] === '-' ? '-' : `${fundData.categoryAvg[period]}%`}
                        </Text>
                        <View style={[
                            styles.rankBadge,
                            fundData.rankings[period] <= 3 && styles.rankBadgeTop
                        ]}>
                            <Text style={[
                                styles.rankText,
                                fundData.rankings[period] <= 3 && styles.rankTextTop
                            ]}>
                                {fundData.rankings[period]}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
            
            {/* Fund vs Category */}
            <View style={styles.comparisonCard}>
                <Text style={styles.comparisonTitle}>Fund vs Category</Text>
                <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Fund Returns (3Y)</Text>
                    <Text style={styles.comparisonValue}>{fundData.returns['3Y']}%</Text>
                </View>
                <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Category Avg (3Y)</Text>
                    <Text style={styles.comparisonValue}>{fundData.categoryAvg['3Y']}%</Text>
                </View>
                <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Rank (3Y)</Text>
                    <Text style={styles.comparisonValue}>#{fundData.rankings['3Y']}</Text>
                </View>
            </View>
        </View>
    );

    const renderCalculatorContent = () => {
        const durations = [
            { label: '1 year', value: 1 },
            { label: '3 years', value: 3 },
            { label: '5 years', value: 5 }
        ];

        return (
            <View>
                <View style={styles.calculatorTabs}>
                    <TouchableOpacity style={[styles.calcTab, styles.calcTabActive]}>
                        <Text style={styles.calcTabText}>Monthly SIP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.calcTab}>
                        <Text style={styles.calcTabText}>One-Time</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.calculatorInput}>
                    <Text style={styles.calcLabel}>Monthly investment amount</Text>
                    <View style={styles.amountSlider}>
                        <View style={styles.sliderTrack}>
                            <View style={[styles.sliderProgress, { width: '60%' }]} />
                        </View>
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderLabel}>₹1,000</Text>
                            <Text style={styles.sliderLabel}>₹10,000</Text>
                        </View>
                    </View>
                    
                    <View style={styles.quickAmounts}>
                        <TouchableOpacity style={styles.quickAmount}>
                            <Text style={styles.quickAmountText}>₹1,000</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAmount}>
                            <Text style={styles.quickAmountText}>₹5,000</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAmount}>
                            <Text style={styles.quickAmountText}>₹10,000</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.calculatorResult}>
                    <Text style={styles.resultTitle}>Projected value after 3 years</Text>
                    <Text style={styles.resultValue}>₹{fundData.sipCalculator.returns.toLocaleString('en-IN')}</Text>
                    <Text style={styles.resultSubtitle}>
                        Investment: ₹{fundData.sipCalculator.investment.toLocaleString('en-IN')} • 
                        Returns: +{fundData.sipCalculator.percentage}%
                    </Text>
                </View>
            </View>
        );
    };

    const renderHoldingsContent = () => (
        <View>
            <Text style={styles.holdingsNote}>Top 3 holdings • {fundData.holdings.reduce((acc, h) => acc + parseFloat(h.percentage), 0)}% of total assets</Text>
            
            {fundData.holdings.map((holding, index) => (
                <View key={index} style={styles.holdingItem}>
                    <View style={styles.holdingInfo}>
                        <Text style={styles.holdingName}>{holding.name}</Text>
                        <Text style={styles.holdingPercentage}>{holding.percentage}</Text>
                    </View>
                    <View style={styles.holdingBar}>
                        <View style={[styles.holdingBarFill, { width: holding.percentage }]} />
                    </View>
                </View>
            ))}
            
            <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View all holdings</Text>
                <Feather name="chevron-right" size={16} color="#1A365D" />
            </TouchableOpacity>
        </View>
    );

    const renderExpenseContent = () => (
        <View>
            <View style={styles.expenseItem}>
                <Text style={styles.expenseLabel}>Expense Ratio</Text>
                <Text style={styles.expenseValue}>{fundData.expenseRatio}</Text>
            </View>
            <View style={styles.expenseItem}>
                <Text style={styles.expenseLabel}>Exit Load</Text>
                <Text style={styles.expenseValue}>{fundData.exitLoad}</Text>
            </View>
            <View style={styles.expenseItem}>
                <Text style={styles.expenseLabel}>Stamp Duty</Text>
                <Text style={styles.expenseValue}>{fundData.stampDuty}</Text>
            </View>
            
            <View style={styles.taxCard}>
                <MaterialIcons name="account-balance" size={20} color="#059669" />
                <Text style={styles.taxTitle}>Tax Implications</Text>
                <Text style={styles.taxText}>{fundData.taxImplication}</Text>
            </View>
        </View>
    );

    const renderFundManagementContent = () => (
        <View>
            <View style={styles.managerCard}>
                <View style={styles.managerAvatar}>
                    <FontAwesome5 name="user-tie" size={24} color="#64748B" />
                </View>
                <View style={styles.managerInfo}>
                    <Text style={styles.managerName}>{fundData.fundManager.name}</Text>
                    <Text style={styles.managerRole}>{fundData.fundManager.role}</Text>
                    <Text style={styles.managerExp}>{fundData.fundManager.experience}</Text>
                </View>
                <TouchableOpacity style={styles.viewProfileBtn}>
                    <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFundHouseContent = () => (
        <View>
            <View style={styles.fundHouseCard}>
                <View style={styles.fundHouseHeader}>
                    <MaterialCommunityIcons name="bank" size={24} color="#1A365D" />
                    <Text style={styles.fundHouseName}>{fundData.fundHouse}</Text>
                </View>
                <Text style={styles.objectiveTitle}>Investment Objective</Text>
                <Text style={styles.objectiveText}>{fundData.investmentObjective}</Text>
                
                <View style={styles.fundDetails}>
                    <View style={styles.detailItem}>
                        <Feather name="package" size={16} color="#64748B" />
                        <Text style={styles.detailText}>Fund Size: {fundData.fundSize}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="payments" size={16} color="#64748B" />
                        <Text style={styles.detailText}>Min SIP: {fundData.minSipAmount}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderProsConsContent = () => (
        <View>
            <View style={styles.prosConsGrid}>
                <View style={styles.prosColumn}>
                    <Text style={styles.prosTitle}>Pros</Text>
                    {fundData.pros.map((pro, index) => (
                        <View key={index} style={styles.listItem}>
                            <MaterialIcons name="check-circle" size={16} color="#059669" />
                            <Text style={styles.listText}>{pro}</Text>
                        </View>
                    ))}
                </View>
                
                <View style={styles.consColumn}>
                    <Text style={styles.consTitle}>Cons</Text>
                    {fundData.cons.map((con, index) => (
                        <View key={index} style={styles.listItem}>
                            <MaterialIcons name="cancel" size={16} color="#DC2626" />
                            <Text style={styles.listText}>{con}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Fund Details</Text>
                </View>
                <TouchableOpacity style={styles.headerButton}>
                    <Feather name="share-2" size={20} color="#1A365D" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Fund Header */}
                <View style={styles.fundHeader}>
                    <View style={styles.fundTitleRow}>
                        <View style={styles.fundIcon}>
                            <MaterialCommunityIcons name="gold" size={28} color="#F59E0B" />
                        </View>
                        <View style={styles.fundNameContainer}>
                            <Text style={styles.fundName}>{fundData.name}</Text>
                            <View style={styles.fundMeta}>
                                <View style={styles.riskBadge}>
                                    <Ionicons name="alert-circle" size={14} color="#DC2626" />
                                    <Text style={styles.riskText}>{fundData.risk}</Text>
                                </View>
                                <Text style={styles.categoryText}>• {fundData.category}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.navContainer}>
                        <View style={styles.navRow}>
                            <Text style={styles.navLabel}>NAV</Text>
                            <Text style={styles.navValue}>₹{fundData.nav}</Text>
                            <Text style={styles.navDate}>{fundData.navDate}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            {renderStars(fundData.rating)}
                            <Text style={styles.ratingText}>{fundData.rating} ★</Text>
                        </View>
                    </View>

                    <View style={styles.returnRow}>
                        <View style={styles.annualReturn}>
                            <Text style={styles.annualReturnLabel}>Annualised</Text>
                            <Text style={styles.annualReturnValue}>{fundData.annualizedReturn}</Text>
                        </View>
                        <View style={styles.dayChange}>
                            <Feather name="trending-up" size={16} color="#10B981" />
                            <Text style={styles.dayChangeText}>{fundData.oneDayChange}</Text>
                        </View>
                    </View>
                </View>

                {/* Graph Section */}
                <View style={styles.graphSection}>
                    {renderPeriodTabs()}
                    {renderGraph()}
                </View>

                {/* Current Price */}
                <View style={styles.priceCard}>
                    <View style={styles.priceContent}>
                        <View>
                            <Text style={styles.priceLabel}>Current Price</Text>
                            <Text style={styles.priceValue}>₹{fundData.currentPrice}</Text>
                        </View>
                        <View style={styles.changeContainer}>
                            <MaterialIcons name="show-chart" size={24} color="#10B981" />
                            <Text style={styles.changePercentage}>{fundData.changePercentage}%</Text>
                        </View>
                    </View>
                </View>

                {/* Collapsible Sections */}
                {renderCollapsibleSection(
                    'Return calculator',
                    <MaterialCommunityIcons name="calculator" size={20} color="#1A365D" />,
                    'calculator',
                    renderCalculatorContent()
                )}

                {renderCollapsibleSection(
                    'Holdings',
                    <MaterialIcons name="pie-chart" size={20} color="#1A365D" />,
                    'holdings',
                    renderHoldingsContent(),
                    fundData.holdings.length
                )}

                {renderCollapsibleSection(
                    'Returns & rankings',
                    <MaterialIcons name="trending-up" size={20} color="#1A365D" />,
                    'returns',
                    renderReturnsContent()
                )}

                {renderCollapsibleSection(
                    'Expense ratio, exit load & tax',
                    <MaterialIcons name="percent" size={20} color="#1A365D" />,
                    'expense',
                    renderExpenseContent()
                )}

                {renderCollapsibleSection(
                    'Fund management',
                    <FontAwesome5 name="user-tie" size={18} color="#1A365D" />,
                    'fundManagement',
                    renderFundManagementContent()
                )}

                {renderCollapsibleSection(
                    'Fund house & investment objective',
                    <MaterialCommunityIcons name="bank" size={20} color="#1A365D" />,
                    'fundHouse',
                    renderFundHouseContent()
                )}

                {renderCollapsibleSection(
                    'Pros and cons',
                    <Entypo name="light-up" size={20} color="#1A365D" />,
                    'prosCons',
                    renderProsConsContent()
                )}

                {/* Recently Viewed */}
                <View style={styles.recentlyViewed}>
                    <Text style={styles.recentTitle}>Recently viewed</Text>
                    <View style={styles.recentCard}>
                        <View style={styles.recentFundIcon}>
                            <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.recentFundInfo}>
                            <Text style={styles.recentFundName}>HDFC Consumption Fund</Text>
                            <View style={styles.recentFundMeta}>
                                <Text style={styles.recentFundReturn}>3Y: 18.2%</Text>
                                <Text style={styles.recentFundCategory}>Equity • Thematic</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.investButton}>
                            <Text style={styles.investButtonText}>Invest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.oneTimeButton}>
                    <MaterialIcons name="payments" size={20} color="#1A365D" />
                    <Text style={styles.oneTimeButtonText}>One-time</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sipButton}>
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="#fff" />
                    <Text style={styles.sipButtonText}>Start SIP</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    headerButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingBottom: 120,
    },
    fundHeader: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    fundTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    fundIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fundNameContainer: {
        flex: 1,
    },
    fundName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    fundMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    riskBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
    },
    riskText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#DC2626',
        marginLeft: 4,
    },
    categoryText: {
        fontSize: 14,
        color: '#6B7280',
    },
    navContainer: {
        marginBottom: 16,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    navLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
    },
    navValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 12,
    },
    navDate: {
        fontSize: 14,
        color: '#6B7280',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        marginRight: 6,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
    returnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    annualReturn: {
        alignItems: 'flex-start',
    },
    annualReturnLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    annualReturnValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#059669',
    },
    dayChange: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    dayChangeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#065F46',
        marginLeft: 4,
    },
    graphSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    periodTabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    periodTab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    periodTabActive: {
        backgroundColor: '#1A365D',
    },
    periodTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    periodTabTextActive: {
        color: '#fff',
    },
    graphContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    performanceIndicator: {
        marginTop: 10,
        alignItems: 'center',
    },
    performanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    performanceText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#065F46',
        marginLeft: 4,
    },
    priceCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    priceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1F2937',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changePercentage: {
        fontSize: 20,
        fontWeight: '700',
        color: '#10B981',
        marginLeft: 8,
    },
    // Section Styles
    sectionContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: '#fff',
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sectionIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    badge: {
        backgroundColor: '#1A365D',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    sectionContent: {
        padding: 20,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    // Returns Section
    returnsTable: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableHeaderText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        textAlign: 'center',
    },
    returnsValue: {
        color: '#059669',
        fontWeight: '600',
    },
    rankBadge: {
        backgroundColor: '#F1F5F9',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankBadgeTop: {
        backgroundColor: '#10B981',
    },
    rankText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    rankTextTop: {
        color: '#fff',
    },
    comparisonCard: {
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 16,
    },
    comparisonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A365D',
        marginBottom: 12,
    },
    comparisonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    comparisonLabel: {
        fontSize: 14,
        color: '#475569',
    },
    comparisonValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    // Calculator Section
    calculatorTabs: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        padding: 4,
        marginBottom: 20,
    },
    calcTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    calcTabActive: {
        backgroundColor: '#1A365D',
    },
    calcTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    calculatorInput: {
        marginBottom: 20,
    },
    calcLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    amountSlider: {
        marginBottom: 16,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginBottom: 8,
    },
    sliderProgress: {
        height: 6,
        backgroundColor: '#1A365D',
        borderRadius: 3,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    quickAmount: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        alignItems: 'center',
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
    },
    calculatorResult: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#059669',
        marginBottom: 4,
    },
    resultSubtitle: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },
    // Holdings Section
    holdingsNote: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 16,
    },
    holdingItem: {
        marginBottom: 16,
    },
    holdingInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    holdingName: {
        fontSize: 15,
        color: '#1F2937',
    },
    holdingPercentage: {
        fontSize: 15,
        fontWeight: '600',
        color: '#059669',
    },
    holdingBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    holdingBarFill: {
        height: '100%',
        backgroundColor: '#059669',
        borderRadius: 3,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 8,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A365D',
        marginRight: 4,
    },
    // Expense Section
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    expenseLabel: {
        fontSize: 15,
        color: '#475569',
    },
    expenseValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    taxCard: {
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    taxTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A365D',
        marginTop: 8,
        marginBottom: 8,
    },
    taxText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    // Fund Management Section
    managerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
    },
    managerAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    managerInfo: {
        flex: 1,
    },
    managerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    managerRole: {
        fontSize: 14,
        color: '#1A365D',
        marginBottom: 2,
    },
    managerExp: {
        fontSize: 12,
        color: '#6B7280',
    },
    viewProfileBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    viewProfileText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A365D',
    },
    // Fund House Section
    fundHouseCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
    },
    fundHouseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    fundHouseName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A365D',
        marginLeft: 12,
    },
    objectiveTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    objectiveText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 16,
    },
    fundDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailText: {
        fontSize: 13,
        color: '#64748B',
        marginLeft: 6,
    },
    // Pros & Cons Section
    prosConsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    prosColumn: {
        flex: 1,
    },
    consColumn: {
        flex: 1,
    },
    prosTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#059669',
        marginBottom: 12,
    },
    consTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DC2626',
        marginBottom: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    listText: {
        fontSize: 14,
        color: '#475569',
        marginLeft: 8,
        flex: 1,
    },
    // Recently Viewed
    recentlyViewed: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    recentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    recentFundIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recentFundInfo: {
        flex: 1,
    },
    recentFundName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    recentFundMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentFundReturn: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '600',
        marginRight: 8,
    },
    recentFundCategory: {
        fontSize: 13,
        color: '#64748B',
    },
    investButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#1A365D',
        borderRadius: 8,
    },
    investButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    // Bottom Actions
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    oneTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginRight: 12,
        gap: 8,
    },
    oneTimeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A365D',
    },
    sipButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A365D',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    sipButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default FundDetail;