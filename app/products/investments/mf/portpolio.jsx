import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import {
  MaterialIcons,
  Feather,
  FontAwesome,
  Ionicons,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#1A365D';
const SECONDARY_COLOR = '#4C8BF5';
const GREEN = '#10B981';
const RED = '#EF4444';
const GRAY = '#6B7280';
const LIGHT_GRAY = '#F3F4F6';

// Mock data for orders
const ordersData = [
  {
    id: '1',
    fundName: 'Nifty 50 Index Fund',
    type: 'Buy',
    status: 'Successful',
    amount: 1000,
    date: '28 Jan 2026',
    units: 10.5,
    nav: 95.24,
  },
  {
    id: '2',
    fundName: 'Nifty India Manufacturing Index Fund',
    type: 'Buy',
    status: 'Successful',
    amount: 100,
    date: '28 Jan 2026',
    units: 1.2,
    nav: 83.33,
  },
  {
    id: '3',
    fundName: 'Nifty Next 50 Index Fund',
    type: 'Buy',
    status: 'Successful',
    amount: 100,
    date: '28 Jan 2026',
    units: 0.8,
    nav: 125.00,
  },
  {
    id: '4',
    fundName: 'Nifty 50 Index Fund',
    type: 'Sell',
    status: 'Successful',
    amount: 989,
    date: '27 Jan 2026',
    units: -10.4,
    nav: 95.10,
  },
  {
    id: '5',
    fundName: 'Nifty India Manufacturing Index Fund',
    type: 'Sell',
    status: 'Pending',
    amount: 150,
    date: '29 Jan 2026',
    units: -1.8,
    nav: 83.33,
  },
];

// Mock data for SIPs
const sipsData = [
  {
    id: '1',
    fundName: 'Nifty 50 Index Fund',
    amount: 1000,
    status: 'Active',
    nextInstallment: '20 Feb 2026',
    frequency: 'Monthly',
    startDate: '20 Jan 2026',
    instalments: 1,
    category: 'Index Fund',
  },
  {
    id: '2',
    fundName: 'Parag Parikh Flexi Cap Fund',
    amount: 2000,
    status: 'Active',
    nextInstallment: '25 Feb 2026',
    frequency: 'Monthly',
    startDate: '25 Jan 2026',
    instalments: 1,
    category: 'Equity Fund',
  },
  {
    id: '3',
    fundName: 'Axis Bluechip Fund',
    amount: 500,
    status: 'Paused',
    nextInstallment: 'Paused',
    frequency: 'Monthly',
    startDate: '15 Jan 2026',
    instalments: 2,
    category: 'Large Cap',
  },
];

// Mock portfolio data
const portfolioData = [
  {
    id: '1',
    fundName: 'Nifty 50 Index Fund',
    invested: 1000,
    currentValue: 1005.24,
    units: 10.5,
    returns: 5.24,
    returnsPercent: 0.52,
    dayChange: 2.50,
    dayChangePercent: 0.25,
    category: 'Index Funds',
    icon: 'chart-line',
    color: '#3B82F6',
  },
  {
    id: '2',
    fundName: 'Nifty India Manufacturing Index Fund',
    invested: 100,
    currentValue: 100.00,
    units: 1.2,
    returns: 0.00,
    returnsPercent: 0.00,
    dayChange: 0.00,
    dayChangePercent: 0.00,
    category: 'Index Funds',
    icon: 'factory',
    color: '#10B981',
  },
  {
    id: '3',
    fundName: 'Nifty Next 50 Index Fund',
    invested: 100,
    currentValue: 100.00,
    units: 0.8,
    returns: 0.00,
    returnsPercent: 0.00,
    dayChange: 0.00,
    dayChangePercent: 0.00,
    category: 'Index Funds',
    icon: 'chart-areaspline',
    color: '#8B5CF6',
  },
];

const Investments = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Portfolio');
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  // Calculate totals
  const totalInvested = portfolioData.reduce((sum, item) => sum + item.invested, 0);
  const totalCurrentValue = portfolioData.reduce((sum, item) => sum + item.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnsPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const totalDayChange = portfolioData.reduce((sum, item) => sum + item.dayChange, 0);
  const totalDayChangePercent = totalCurrentValue > 0 ? (totalDayChange / totalCurrentValue) * 100 : 0;


  const handleViewDetails = ()=>{
    console.log("hello")
    router.push("/products/investments/mf/order")
  }
  // SIP stats
  const activeSIPs = sipsData.filter(sip => sip.status === 'Active').length;
  const pausedSIPs = sipsData.filter(sip => sip.status === 'Paused').length;
  const monthlyInvestments = sipsData
    .filter(sip => sip.status === 'Active')
    .reduce((sum, sip) => sum + sip.amount, 0);

  const filteredOrders = ordersData.filter(order => {
    if (filter === 'All') return true;
    if (filter === 'Buy') return order.type === 'Buy';
    if (filter === 'Sell') return order.type === 'Sell';
    if (filter === 'Completed') return order.status === 'Successful';
    if (filter === 'Pending') return order.status === 'Pending';
    return true;
  });

  const renderPortfolio = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Portfolio Summary Card */}
      <View style={styles.portfolioSummaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
            <Text style={styles.totalValue}>₹{totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <Feather name="download" size={18} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>Invested</Text>
            <Text style={styles.statValue}>₹{totalInvested.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>Returns</Text>
            <View style={styles.returnsContainer}>
              <MaterialCommunityIcons 
                name={totalReturns >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={totalReturns >= 0 ? GREEN : RED} 
              />
              <Text style={[styles.returnsValue, totalReturns >= 0 ? styles.positive : styles.negative]}>
                ₹{Math.abs(totalReturns).toFixed(2)} ({totalReturnsPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.dayChangeContainer}>
          <Text style={styles.dayChangeLabel}>Today's Change</Text>
          <View style={styles.dayChangeRow}>
            <Feather 
              name={totalDayChange >= 0 ? "arrow-up-right" : "arrow-down-right"} 
              size={16} 
              color={totalDayChange >= 0 ? GREEN : RED} 
            />
            <Text style={[styles.dayChangeValue, totalDayChange >= 0 ? styles.positive : styles.negative]}>
              ₹{Math.abs(totalDayChange).toFixed(2)} ({totalDayChangePercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
            <FontAwesome name="plus" size={20} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.actionText}>Add Funds</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
            <MaterialIcons name="auto-awesome" size={20} color={GREEN} />
          </View>
          <Text style={styles.actionText}>Start SIP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <MaterialCommunityIcons name="swap-horizontal" size={20} color="#D97706" />
          </View>
          <Text style={styles.actionText}>Switch</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
            <Feather name="trending-down" size={20} color={RED} />
          </View>
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
      
      {/* Holdings Section */}
      <View style={styles.holdingsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Holdings ({portfolioData.length})</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {portfolioData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.holdingCard}>
            <View style={styles.holdingHeader}>
              <View style={[styles.fundIcon, { backgroundColor: `${item.color}15` }]}>
                <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.fundInfo}>
                <Text style={styles.fundName}>{item.fundName}</Text>
                <Text style={styles.fundCategory}>{item.category}</Text>
              </View>
              <View style={styles.holdingValue}>
                <Text style={styles.currentValue}>₹{item.currentValue.toFixed(2)}</Text>
                <View style={styles.returnsBadge}>
                  <Text style={[
                    styles.returnsText,
                    item.returns >= 0 ? styles.positive : styles.negative
                  ]}>
                    {item.returns >= 0 ? '+' : ''}{item.returnsPercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.holdingFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Invested</Text>
                <Text style={styles.footerValue}>₹{item.invested.toFixed(2)}</Text>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Units</Text>
                <Text style={styles.footerValue}>{item.units.toFixed(2)}</Text>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Today</Text>
                <View style={styles.dayChangeBadge}>
                  <Feather 
                    name={item.dayChange >= 0 ? "arrow-up-right" : "arrow-down-right"} 
                    size={12} 
                    color={item.dayChange >= 0 ? GREEN : RED} 
                  />
                  <Text style={[
                    styles.dayChangeText,
                    item.dayChange >= 0 ? styles.positive : styles.negative
                  ]}>
                    {item.dayChange >= 0 ? '+' : ''}{item.dayChangePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderSIPs = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Setup Autopay Card */}
      <View style={styles.autopayCard}>
        <View style={styles.autopayContent}>
          <View style={styles.autopayIconContainer}>
            <MaterialIcons name="auto-awesome" size={28} color="#fff" />
          </View>
          <View style={styles.autopayTextContainer}>
            <Text style={styles.autopayTitle}>Setup autopay for seamless SIP payments</Text>
            <Text style={styles.autopaySubtitle}>Never miss an installment with automated payments</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.autopayButton}>
          <Text style={styles.autopayButtonText}>Setup Now</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* SIP Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
            <FontAwesome5 name="rupee-sign" size={20} color={GREEN} />
          </View>
          <Text style={styles.statCardLabel}>Monthly Investment</Text>
          <Text style={styles.statCardValue}>₹{monthlyInvestments.toLocaleString('en-IN')}</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.statCardLabel}>Active SIPs</Text>
          <Text style={styles.statCardValue}>{activeSIPs}</Text>
        </View>
      </View>
      
      {/* My SIPs Section */}
      <View style={styles.sipsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My SIPs ({sipsData.length})</Text>
          <TouchableOpacity style={styles.addButton}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>New SIP</Text>
          </TouchableOpacity>
        </View>
        
        {sipsData.map((sip) => (
          <View key={sip.id} style={styles.sipCard}>
            <View style={styles.sipHeader}>
              <View style={styles.sipFundInfo}>
                <View style={[styles.sipIcon, { backgroundColor: sip.status === 'Active' ? '#D1FAE5' : '#FEF3C7' }]}>
                  <MaterialCommunityIcons 
                    name="calendar-clock" 
                    size={20} 
                    color={sip.status === 'Active' ? GREEN : '#D97706'} 
                  />
                </View>
                <View>
                  <Text style={styles.fundName}>{sip.fundName}</Text>
                  <Text style={styles.fundCategory}>{sip.category}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: sip.status === 'Active' ? `${GREEN}15` : `${'#D97706'}15` }
              ]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: sip.status === 'Active' ? GREEN : '#D97706' }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: sip.status === 'Active' ? GREEN : '#D97706' }
                ]}>
                  {sip.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.sipDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="currency-inr" size={16} color={GRAY} />
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>₹{sip.amount}/month</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="calendar" size={16} color={GRAY} />
                  <Text style={styles.detailLabel}>Next:</Text>
                  <Text style={styles.detailValue}>{sip.nextInstallment}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="repeat" size={16} color={GRAY} />
                  <Text style={styles.detailLabel}>Frequency:</Text>
                  <Text style={styles.detailValue}>{sip.frequency}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="counter" size={16} color={GRAY} />
                  <Text style={styles.detailLabel}>Instalments:</Text>
                  <Text style={styles.detailValue}>{sip.instalments}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.sipActions}>
              {sip.status === 'Active' ? (
                <>
                  <TouchableOpacity style={[styles.sipActionButton, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialCommunityIcons name="pause" size={16} color="#D97706" />
                    <Text style={[styles.sipActionText, { color: '#D97706' }]}>Pause</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sipActionButton, { backgroundColor: '#DBEAFE' }]}>
                    <Feather name="edit-2" size={16} color={PRIMARY_COLOR} />
                    <Text style={[styles.sipActionText, { color: PRIMARY_COLOR }]}>Modify</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.sipActionButton, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialIcons name="play-arrow" size={16} color={GREEN} />
                  <Text style={[styles.sipActionText, { color: GREEN }]}>Resume</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.sipActionButton, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="cancel" size={16} color={RED} />
                <Text style={[styles.sipActionText, { color: RED }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderOrders = () => (
    <View style={styles.tabContent}>
      {/* Orders Header with Filter */}
      <View style={styles.ordersHeader}>
        <View>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <Text style={styles.ordersSubtitle}>{filteredOrders.length} orders found</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <Feather name="filter" size={18} color={PRIMARY_COLOR} />
          <Text style={styles.filterButtonText}> {filter}</Text>
        </TouchableOpacity>
      </View>
      
      {showFilter && (
        <View style={styles.filterOptions}>
          {['All', 'Buy', 'Sell', 'Completed', 'Pending'].map((option) => (
            <TouchableOpacity 
              key={option}
              style={[
                styles.filterOption,
                filter === option && styles.filterOptionActive
              ]}
              onPress={() => {
                setFilter(option);
                setShowFilter(false);
              }}
            >
              <Text style={[
                styles.filterOptionText,
                filter === option && styles.filterOptionTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderTypeIcon}>
                <MaterialCommunityIcons 
                  name={item.type === 'Buy' ? "arrow-up-bold-circle" : "arrow-down-bold-circle"} 
                  size={24} 
                  color={item.type === 'Buy' ? GREEN : RED} 
                />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.fundName}>{item.fundName}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
              </View>
              <View style={styles.orderAmount}>
                <Text style={[
                  styles.amountText,
                  { color: item.type === 'Buy' ? GREEN : RED }
                ]}>
                  {item.type === 'Buy' ? '-' : '+'}₹{item.amount}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.detailColumn}>
                <View style={[
                  styles.statusContainer,
                  { backgroundColor: item.status === 'Successful' ? '#D1FAE5' : '#FEF3C7' }
                ]}>
                  <Feather 
                    name={item.status === 'Successful' ? "check-circle" : "clock"} 
                    size={14} 
                    color={item.status === 'Successful' ? GREEN : '#D97706'} 
                  />
                  <Text style={[
                    styles.statusText,
                    { color: item.status === 'Successful' ? GREEN : '#D97706' }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.orderMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Units:</Text>
                  <Text style={styles.metaValue}>{item.units >= 0 ? '+' : ''}{item.units}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>NAV:</Text>
                  <Text style={styles.metaValue}>₹{item.nav.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.orderActions}>
              <TouchableOpacity onPress={handleViewDetails} style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Feather name="chevron-right" size={16} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Investments</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Feather name="help-circle" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
      
      {/* Tabs with Icons */}
      <View style={styles.tabsContainer}>
        {[
          { name: 'Portfolio', icon: 'pie-chart' },
          { name: 'SIPs', icon: 'calendar' },
          { name: 'Orders', icon: 'shopping-cart' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tab,
              activeTab === tab.name && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.name)}
          >
            <Feather 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.name ? PRIMARY_COLOR : GRAY} 
              style={styles.tabIcon}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.name && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
            {activeTab === tab.name && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Tab Content */}
      {activeTab === 'Portfolio' && renderPortfolio()}
      {activeTab === 'SIPs' && renderSIPs()}
      {activeTab === 'Orders' && renderOrders()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  helpButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    position: 'relative',
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: GRAY,
  },
  activeTabText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 3,
    backgroundColor: PRIMARY_COLOR,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tabContent: {
    flex: 1,
  },
  // Portfolio Styles
  portfolioSummaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  exportButton: {
    padding: 8,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  returnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  returnsValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayChangeLabel: {
    fontSize: 14,
    color: GRAY,
  },
  dayChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayChangeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: GREEN,
  },
  negative: {
    color: RED,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 32) / 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  holdingsSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  holdingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  holdingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fundIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  fundCategory: {
    fontSize: 12,
    color: GRAY,
  },
  holdingValue: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  returnsBadge: {
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  returnsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  holdingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  dayChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dayChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // SIPs Styles
  autopayCard: {
    backgroundColor: PRIMARY_COLOR,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  autopayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  autopayIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  autopayTextContainer: {
    flex: 1,
  },
  autopayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  autopaySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  autopayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  autopayButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardLabel: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 4,
    textAlign: 'center',
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  sipsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  sipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sipFundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sipDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: GRAY,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  sipActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  sipActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  sipActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Orders Styles
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ordersSubtitle: {
    fontSize: 14,
    color: GRAY,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY_COLOR,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 6,
  },
  filterOptionActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTypeIcon: {
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderDate: {
    fontSize: 12,
    color: GRAY,
    marginTop: 2,
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailColumn: {
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: GRAY,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  orderActions: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
});

export default Investments;