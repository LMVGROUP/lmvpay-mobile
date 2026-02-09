import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import {
  MaterialIcons,
  Feather,
  FontAwesome,
  Ionicons,
  AntDesign,
  FontAwesome5,
} from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Mock data for fund categories
const categories = [
  { id: '1', name: 'All', icon: 'pie-chart', iconType: 'Feather' },
  { id: '2', name: 'Large Cap', icon: 'bar-chart', iconType: 'Feather' },
  { id: '3', name: 'Mid Cap', icon: 'trending-up', iconType: 'Feather' },
  { id: '4', name: 'Flexi Cap', icon: 'target', iconType: 'Feather' },
  { id: '5', name: 'Index Funds', icon: 'chart-bar', iconType: 'FontAwesome5' },
  { id: '6', name: 'ELSS', icon: 'shield', iconType: 'Feather' },
  { id: '7', name: 'Small Cap', icon: 'rocket', iconType: 'MaterialIcons' },
  { id: '8', name: 'Low Risk', icon: 'lock', iconType: 'Feather' },
];

// Mock data for funds
const fundsData = [
  {
    id: '1',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Flexi Cap',
    returns: '18.4%',
    returnPeriod: '3Y',
    risk: 'Moderate',
    minSip: 1000,
    expenseRatio: '0.65%',
    tags: ['🔥 Best for Beginners', '⭐ Low Expense Ratio'],
  },
  {
    id: '2',
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    returns: '15.2%',
    returnPeriod: '3Y',
    risk: 'Low',
    minSip: 500,
    expenseRatio: '0.70%',
    tags: ['📈 Consistent Performer'],
  },
  {
    id: '3',
    name: 'Mirae Asset Mid Cap Fund',
    category: 'Mid Cap',
    returns: '22.1%',
    returnPeriod: '3Y',
    risk: 'High',
    minSip: 1000,
    expenseRatio: '0.75%',
    tags: ['🔥 Best for Beginners'],
  },
  {
    id: '4',
    name: 'UTI Nifty 50 Index Fund',
    category: 'Index Funds',
    returns: '14.8%',
    returnPeriod: '3Y',
    risk: 'Low',
    minSip: 500,
    expenseRatio: '0.20%',
    tags: ['⭐ Low Expense Ratio'],
  },
  {
    id: '5',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    returns: '26.5%',
    returnPeriod: '3Y',
    risk: 'High',
    minSip: 500,
    expenseRatio: '0.85%',
    tags: ['📈 Consistent Performer'],
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [funds, setFunds] = useState(fundsData);
  const router = useRouter();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Filter funds based on selected category
    if (category === 'All') {
      setFunds(fundsData);
    } else {
      const filteredFunds = fundsData.filter((fund) =>
        fund.category
          .toLowerCase()
          .includes(category.toLowerCase().replace(' ', ''))
      );
      setFunds(filteredFunds);
    }
  };

  const handleMF =()=>{
    router.push("products/investments/mf/portpolio")
  }

  const handleInvestPress = () => {
    // Navigation to login/signup would go here
    router.push("products/investments/mf/funddetail")
    console.log('Invest button pressed - redirect to login');
  };

  const renderIcon = (iconType, iconName, size, color) => {
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} size={size} color={color} />;
      case 'FontAwesome':
        return <FontAwesome name={iconName} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={iconName} size={size} color={color} />;
      case 'AntDesign':
        return <AntDesign name={iconName} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      default:
        return <Feather name={iconName} size={size} color={color} />;
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        selectedCategory === item.name && styles.categoryPillActive,
      ]}
      onPress={() => handleCategorySelect(item.name)}>
      {renderIcon(
        item.iconType,
        item.icon,
        16,
        selectedCategory === item.name ? '#fff' : '#666'
      )}
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.name && styles.categoryTextActive,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFundCard = ({ item }) => (
    <View style={styles.fundCard}>
      {/* Top Row */}
      <View style={styles.fundCardHeader}>
        <View style={styles.fundNameContainer}>
          <Text style={styles.fundName} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) },
            ]}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Middle Section - Returns and Risk */}
      <View style={styles.fundStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{item.returnPeriod} Returns</Text>
          <View style={styles.returnContainer}>
            <Feather name="trending-up" size={14} color="#10B981" />
            <Text style={styles.returnsText}>{item.returns}</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Risk Level</Text>
          <View
            style={[
              styles.riskBadge,
              { backgroundColor: getRiskColor(item.risk) },
            ]}>
            <Text style={styles.riskText}>{item.risk}</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Expense Ratio</Text>
          <Text style={styles.expenseRatio}>{item.expenseRatio}</Text>
        </View>
      </View>

      {/* Bottom Section - Min SIP and Action */}
      <View style={styles.fundCardFooter}>
        <View style={styles.sipInfo}>
          <Text style={styles.sipLabel}>Min SIP</Text>
          <Text style={styles.sipAmount}>₹{item.minSip}</Text>
        </View>

        <TouchableOpacity style={styles.viewButton} onPress={handleInvestPress}>
          <Feather name="lock" size={16} color="#1A365D" />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Large Cap':
        return '#3B82F6';
      case 'Mid Cap':
        return '#F59E0B';
      case 'Flexi Cap':
        return '#8B5CF6';
      case 'Index Funds':
        return '#1E40AF';
      case 'ELSS':
        return '#EF4444';
      case 'Small Cap':
        return '#DC2626';
      case 'Low Risk':
        return '#78350F';
      default:
        return '#059669';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return '#10B981';
      case 'moderate':
        return '#F59E0B';
      case 'high':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Portfolio Header Section */}
      <View style={styles.portfolioHeader}>
        
        <View style={styles.portfolioContainer}>
          <Text style={styles.portfolioLabel}>My portfolio</Text>
          <Text style={styles.portfolioValue}>₹670.61</Text>
          
          <View style={styles.portfolioItems}>
            <TouchableOpacity onPress={handleMF} style={styles.portfolioItem}>
              <View style={styles.portfolioItemLeft}>
                <MaterialIcons name="account-balance" size={20} color="#1A365D" />
                <Text style={styles.portfolioItemText}>Mutual Fund</Text>
              </View>
              <View style={styles.portfolioItemRight}>
                <Text style={styles.portfolioItemValue}>₹1006760</Text>
                <Feather name="chevron-right" size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
            
          </View>

        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Fund Categories Section - Moved to top after portfolio */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
        </View>

        {/* Top Funds Section */}
        <View style={styles.fundsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Top Funds in {selectedCategory}
            </Text>
            <TouchableOpacity style={styles.browseAll}>
              <Text style={styles.browseAllText}>Browse All Funds</Text>
              <Feather name="chevron-right" size={16} color="#1A365D" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={funds.slice(0, 5)} // Show max 5 funds
            renderItem={renderFundCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.fundSeparator} />}
          />
        </View>

        {/* Extra Info Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <MaterialIcons name="emoji-events" size={24} color="#1A365D" />
            <Text style={styles.infoCardTitle}>Expert Curated</Text>
            <Text style={styles.infoCardDesc}>
              Handpicked by investment specialists
            </Text>
          </View>

          <View style={styles.infoCard}>
            <FontAwesome name="star" size={24} color="#1A365D" />
            <Text style={styles.infoCardTitle}>Lowest Fees</Text>
            <Text style={styles.infoCardDesc}>
              Zero commission on investments
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Feather name="alert-circle" size={16} color="#6B7280" />
          <Text style={styles.disclaimerText}>
            Mutual fund investments are subject to market risks. Read all scheme
            related documents carefully.
          </Text>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  portfolioHeader: {
    backgroundColor: '#1A365D',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  timeContainer: {
    position: 'absolute',
    top: 16,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  portfolioContainer: {
    paddingHorizontal: 20,
  },
  portfolioLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  portfolioItems: {
    backgroundColor: '#e3dcdc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  portfolioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  portfolioItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioItemText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  portfolioItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioItemValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginRight: 8,
  },
  repeatOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  repeatOrderText: {
    fontSize: 16,
    color: '#1A365D',
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesList: {
    paddingBottom: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: '#1A365D',
    borderColor: '#1A365D',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  fundsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  browseAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  browseAllText: {
    fontSize: 14,
    color: '#1A365D',
    fontWeight: '500',
    marginRight: 2,
  },
  fundCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fundCardHeader: {
    marginBottom: 16,
  },
  fundNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
  },
  fundStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  returnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  expenseRatio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  fundCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sipInfo: {
    flex: 1,
  },
  sipLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  sipAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A365D',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A365D',
    marginLeft: 6,
  },
  fundSeparator: {
    height: 12,
  },
  infoCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  ctaButton: {
    backgroundColor: '#1A365D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Index;