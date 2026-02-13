import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
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
import axios from 'axios';

// Skeleton Loader Component
const FundCardSkeleton = memo(() => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonHeader}>
      <View style={[styles.skeletonLine, { width: '70%', height: 20 }]} />
      <View style={[styles.skeletonLine, { width: '25%', height: 25 }]} />
    </View>
    
    <View style={[styles.skeletonLine, { width: '50%', height: 16, marginVertical: 8 }]} />
    
    <View style={styles.skeletonTags}>
      <View style={[styles.skeletonLine, { width: 80, height: 24 }]} />
      <View style={[styles.skeletonLine, { width: 80, height: 24, marginLeft: 8 }]} />
    </View>
    
    <View style={styles.skeletonStats}>
      <View style={styles.skeletonStat}>
        <View style={[styles.skeletonLine, { width: 50, height: 14 }]} />
        <View style={[styles.skeletonLine, { width: 60, height: 18, marginTop: 4 }]} />
      </View>
      <View style={styles.skeletonDivider} />
      <View style={styles.skeletonStat}>
        <View style={[styles.skeletonLine, { width: 50, height: 14 }]} />
        <View style={[styles.skeletonLine, { width: 60, height: 18, marginTop: 4 }]} />
      </View>
      <View style={styles.skeletonDivider} />
      <View style={styles.skeletonStat}>
        <View style={[styles.skeletonLine, { width: 50, height: 14 }]} />
        <View style={[styles.skeletonLine, { width: 60, height: 18, marginTop: 4 }]} />
      </View>
    </View>
    
    <View style={styles.skeletonFooter}>
      <View>
        <View style={[styles.skeletonLine, { width: 60, height: 14 }]} />
        <View style={[styles.skeletonLine, { width: 80, height: 20, marginTop: 4 }]} />
      </View>
      <View style={[styles.skeletonLine, { width: 120, height: 40 }]} />
    </View>
  </View>
));

const CategoryPillSkeleton = memo(() => (
  <View style={styles.skeletonCategoryPill}>
    <View style={[styles.skeletonLine, { width: 20, height: 20, borderRadius: 10 }]} />
    <View style={[styles.skeletonLine, { width: 60, height: 16, marginLeft: 8 }]} />
  </View>
));

// Memoized Fund Card Component
const FundCard = memo(({ item, onPress }) => {
  const scheme = item.schemeData || {};
  
  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case 'EQUITY': return '#DC2626';
      case 'DEBT': return '#10B981';
      case 'HYBRID': return '#F59E0B';
      case 'OTHERS': return '#6B7280';
      default: return '#059669';
    }
  }, []);

  const getRiskColor = useCallback((risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  }, []);

  return (
    <View style={styles.fundCard}>
      {/* Header with Image and Name */}
      <View style={styles.fundCardHeader}>
        <View style={styles.fundHeaderLeft}>
          {scheme.image ? (
            <Image 
              source={{ uri: scheme.image }} 
              style={styles.fundImage}
            />
          ) : (
            <View style={styles.fundImagePlaceholder}>
              <MaterialIcons name="account-balance" size={24} color="#1A365D" />
            </View>
          )}
          <View style={styles.fundTitleContainer}>
            <Text style={styles.fundName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.fundCodeContainer}>
              <Text style={styles.fundCode}>{scheme.scheme_code || 'N/A'}</Text>
              {scheme.amc_name && (
                <Text style={styles.amcName}> • {scheme.amc_name}</Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category) },
          ]}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>

      {/* Tags */}
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Middle Section - NAV and Risk */}
      <View style={styles.fundStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>NAV</Text>
          <View style={styles.returnContainer}>
            <Feather name="trending-up" size={14} color="#10B981" />
            <Text style={styles.navText}>₹{parseFloat(scheme.nav || 0).toFixed(4)}</Text>
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
          <Text style={styles.statLabel}>Returns (3Y)</Text>
          <Text style={styles.returnsText}>{item.returns}</Text>
        </View>
      </View>

      {/* Bottom Section - Min SIP and Action */}
      <View style={styles.fundCardFooter}>
        <View style={styles.sipInfo}>
          <Text style={styles.sipLabel}>Min SIP</Text>
          <Text style={styles.sipAmount}>₹{item.minSip}</Text>
        </View>

        <TouchableOpacity 
          style={styles.viewButton} 
          onPress={() => onPress(item)}
          activeOpacity={0.7}>
          <Feather name="info" size={16} color="#1A365D" />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Memoized Category Pill Component
const CategoryPill = memo(({ item, selected, onPress }) => {
  const renderIcon = useCallback((iconType, iconName, size, color) => {
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
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        selected && styles.categoryPillActive,
      ]}
      onPress={() => onPress(item.name)}
      activeOpacity={0.7}>
      {renderIcon(
        item.iconType,
        item.icon,
        16,
        selected ? '#fff' : '#666'
      )}
      <Text
        style={[
          styles.categoryText,
          selected && styles.categoryTextActive,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
});

// Categories
const categories = [
  { id: '1', name: 'All', icon: 'pie-chart', iconType: 'Feather' },
  { id: '2', name: 'EQUITY', icon: 'trending-up', iconType: 'Feather' },
  { id: '3', name: 'DEBT', icon: 'shield', iconType: 'Feather' },
  { id: '4', name: 'HYBRID', icon: 'layers', iconType: 'Feather' },
  { id: '5', name: 'OTHERS', icon: 'grid', iconType: 'Feather' },
];

const MAX_FUNDS_LIMIT = 500; // Maximum funds to load

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit] = useState(500);
  const [hasMore, setHasMore] = useState(true);
  const [allFunds, setAllFunds] = useState([]);
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true);
  
  const router = useRouter();
  const isMounted = useRef(true);
  const flatListRef = useRef(null);

  const getFundsList = useCallback(async (currentOffset = 0, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (currentOffset === 0 && !isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      console.log("Fetching with offset:", currentOffset, "Limit:", limit);
      
      const response = await axios.get(
        `https://oglonbssd2.execute-api.ap-south-1.amazonaws.com/prod/investments/schemedetails?offset=${currentOffset}&limit=${limit}`
      );
      console.log("one time")
      
      const mainResponse = response.data.data.data;
      const mappedFunds = [];

      // Iterate through each category (EQUITY, DEBT, HYBRID, OTHERS)
      Object.entries(mainResponse).forEach(([categoryType, schemes]) => {
        if (Array.isArray(schemes)) {
          schemes.forEach((scheme, index) => {
            const mappedFund = {
              id: scheme.id?.toString() || `fund-${categoryType}-${index}-${currentOffset}-${Date.now()}`,
              name: scheme.plan_name || scheme.scheme_code || 'Unnamed Fund',
              category: categoryType,
              returns: getRandomReturns(),
              returnPeriod: '3Y',
              risk: getRiskFromCategory(categoryType),
              minSip: getRandomMinSip(),
              tags: getTagsFromScheme(scheme),
              
              // Additional data from API
              schemeData: {
                scheme_code: scheme.scheme_code,
                fund_code: scheme.fund_code,
                amc_name: scheme.amc_name,
                image: scheme.image,
                category: scheme.category || categoryType,
                scheme_type: scheme.scheme_type,
                plan_type: scheme.plan_type,
                plan_opt: scheme.plan_opt,
                nav: scheme.nav,
                exit_load: scheme.exit_load,
                sip_allowed: scheme.sip_allowed,
                amfi_scheme_code: scheme.amfi_scheme_code,
              }
            };
            
            mappedFunds.push(mappedFund);
          });
        }
      });

      if (isRefresh) {
        setAllFunds(mappedFunds);
        setFunds(mappedFunds);
      } else if (currentOffset === 0) {
        setAllFunds(mappedFunds);
        setFunds(mappedFunds);
      } else {
        setAllFunds(prev => [...prev, ...mappedFunds]);
        setFunds(prev => [...prev, ...mappedFunds]);
      }

      // Check if we have more data to load
      const totalFunds = isRefresh ? mappedFunds.length : allFunds.length + mappedFunds.length;
      const hasMoreData = mappedFunds.length === limit;
      setHasMore(hasMoreData && totalFunds < MAX_FUNDS_LIMIT);
      
      if (isLoadingFirstTime) {
        setIsLoadingFirstTime(false);
      }

    } catch(error) {
      console.error('Error fetching funds:', error);
      setHasMore(false);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else if (currentOffset === 0 && !isRefresh) {
        setLoading(false);
      } else {
        // Add a small delay to show loading indicator
        setTimeout(() => {
          setLoadingMore(false);
        }, 500);
      }
    }
  }, [limit, allFunds.length, isLoadingFirstTime]);

  // Helper functions
  const getRandomReturns = useCallback(() => {
    const returns = [12.5, 14.2, 16.8, 18.4, 20.1, 22.5, 24.8, 26.3];
    return `${returns[Math.floor(Math.random() * returns.length)]}%`;
  }, []);

  const getRandomMinSip = useCallback(() => {
    const sips = [500, 1000, 2000, 3000, 5000];
    return sips[Math.floor(Math.random() * sips.length)];
  }, []);

  const getRiskFromCategory = useCallback((categoryType) => {
    switch(categoryType) {
      case 'EQUITY': return 'High';
      case 'DEBT': return 'Low';
      case 'HYBRID': return 'Moderate';
      default: return 'Moderate';
    }
  }, []);

  const getTagsFromScheme = useCallback((scheme) => {
    const tags = [];
    
    if (scheme.exit_load === 'NIL') {
      tags.push('🛡️ No Exit Load');
    }
    
    if (scheme.sip_allowed) {
      tags.push('📅 SIP Available');
    }
    
    return tags.slice(0, 2);
  }, []);

  useEffect(() => {
    getFundsList(0);
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      setFunds(allFunds);
    } else {
      const filteredFunds = allFunds.filter((fund) =>
        fund.category.toLowerCase() === category.toLowerCase()
      );
      setFunds(filteredFunds);
    }
    
    // Scroll to top when category changes
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [allFunds]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && !refreshing) {
      // Prevent fetching if we've already loaded the maximum amount
      if (allFunds.length >= MAX_FUNDS_LIMIT) {
        setHasMore(false);
        return;
      }
      
      const nextOffset = allFunds.length;
      console.log("Loading more with offset:", nextOffset, "Total funds:", allFunds.length);
      getFundsList(nextOffset);
    }
  }, [loadingMore, hasMore, loading, refreshing, allFunds.length, getFundsList]);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    getFundsList(0, true);
  }, [getFundsList]);

  const handleMF = useCallback(() => {
    router.push("products/investments/mf/portpolio");
  }, []);

  const handleInvestPress = useCallback((fund) => {
    router.push({
      pathname: "products/investments/mf/funddetail",
      params: { fundData: JSON.stringify(fund) }
    });
  }, []);

  const renderCategoryItem = useCallback(({ item }) => (
    <CategoryPill
      item={item}
      selected={selectedCategory === item.name}
      onPress={handleCategorySelect}
    />
  ), [selectedCategory, handleCategorySelect]);

  const renderFundCard = useCallback(({ item }) => (
    <FundCard item={item} onPress={handleInvestPress} />
  ), [handleInvestPress]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) {
      if (!hasMore && allFunds.length > 0) {
        return (
          <View style={styles.endReachedContainer}>
            <Text style={styles.endReachedText}>No more funds to load</Text>
          </View>
        );
      }
      return null;
    }
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="large" color="#1A365D" />
        <Text style={styles.loadingMoreText}>Loading more funds...</Text>
      </View>
    );
  }, [loadingMore, hasMore, allFunds.length]);

  const renderHeader = useCallback(() => (
    <>
      {/* Fund Categories Section */}
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

      {/* Top Funds Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'All Funds' : `Top Funds in ${selectedCategory}`}
        </Text>
        {allFunds.length > 0 && (
          <TouchableOpacity style={styles.browseAll} activeOpacity={0.7}>
            <Text style={styles.browseAllText}>Browse All</Text>
            <Feather name="chevron-right" size={16} color="#1A365D" />
          </TouchableOpacity>
        )}
      </View>
    </>
  ), [selectedCategory, allFunds.length, renderCategoryItem]);

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: 200, // Approximate height of each item
    offset: 200 * index,
    index,
  }), []);

  if (loading && allFunds.length === 0 && isLoadingFirstTime) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Portfolio Header Skeleton */}
        <View style={styles.portfolioHeader}>
          <View style={styles.portfolioContainer}>
            <View style={[styles.skeletonLine, { width: 100, height: 16, marginBottom: 4 }]} />
            <View style={[styles.skeletonLine, { width: 150, height: 32, marginBottom: 20 }]} />
            
            <View style={styles.portfolioItems}>
              <View style={styles.portfolioItem}>
                <View style={styles.portfolioItemLeft}>
                  <View style={[styles.skeletonLine, { width: 20, height: 20, borderRadius: 10 }]} />
                  <View style={[styles.skeletonLine, { width: 120, height: 16, marginLeft: 12 }]} />
                </View>
                <View style={styles.portfolioItemRight}>
                  <View style={[styles.skeletonLine, { width: 80, height: 16, marginRight: 8 }]} />
                  <View style={[styles.skeletonLine, { width: 16, height: 16 }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          data={[1, 2, 3]}
          renderItem={() => <FundCardSkeleton />}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.categoriesSection}>
                <View style={[styles.skeletonLine, { width: 200, height: 20, marginBottom: 16 }]} />
                <FlatList
                  horizontal
                  data={[1, 2, 3, 4, 5]}
                  renderItem={() => <CategoryPillSkeleton />}
                  keyExtractor={(item) => item.toString()}
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesList}
                />
              </View>
              <View style={styles.sectionHeader}>
                <View style={[styles.skeletonLine, { width: 180, height: 20 }]} />
                <View style={[styles.skeletonLine, { width: 100, height: 16 }]} />
              </View>
            </>
          }
          ItemSeparatorComponent={() => <View style={styles.fundSeparator} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Portfolio Header Section */}
      <View style={styles.portfolioHeader}>
        <View style={styles.portfolioContainer}>
          <Text style={styles.portfolioLabel}>My portfolio</Text>
          <Text style={styles.portfolioValue}>₹670.61</Text>
          
          <View style={styles.portfolioItems}>
            <TouchableOpacity onPress={handleMF} style={styles.portfolioItem} activeOpacity={0.7}>
              <View style={styles.portfolioItemLeft}>
                <MaterialIcons name="account-balance" size={20} color="#1A365D" />
                <Text style={styles.portfolioItemText}>Mutual Fund</Text>
              </View>
              <View style={styles.portfolioItemRight}>
                <Text style={styles.portfolioItemValue}>₹1,00,676</Text>
                <Feather name="chevron-right" size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={funds}
        renderItem={renderFundCard}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1A365D']}
            tintColor="#1A365D"
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ItemSeparatorComponent={() => <View style={styles.fundSeparator} />}
        ListEmptyComponent={
          !loading && !refreshing && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No funds found</Text>
            </View>
          )
        }
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
        getItemLayout={getItemLayout}
      />

      {/* Full screen loading indicator for initial load */}
      {loading && allFunds.length === 0 && !isLoadingFirstTime && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#1A365D" />
          <Text style={styles.fullScreenLoadingText}>Loading funds...</Text>
        </View>
      )}
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
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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
    marginHorizontal: 20,
  },
  fundCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fundHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  fundImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  fundImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fundTitleContainer: {
    flex: 1,
  },
  fundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 4,
  },
  fundCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  fundCode: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  amcName: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  navText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  returnsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  // Loading styles
  loadingMoreContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  loadingMoreText: {
    marginTop: 12,
    color: '#1A365D',
    fontSize: 14,
    fontWeight: '500',
  },
  endReachedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  endReachedText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenLoadingText: {
    marginTop: 12,
    color: '#1A365D',
    fontSize: 16,
    fontWeight: '500',
  },
  // Skeleton styles
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  skeletonLine: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonTags: {
    flexDirection: 'row',
    marginTop: 8,
  },
  skeletonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  skeletonStat: {
    flex: 1,
    alignItems: 'center',
  },
  skeletonDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F3F4F6',
  },
  skeletonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonCategoryPill: {
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
});

export default Index;