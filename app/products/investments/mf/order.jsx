import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React from 'react';
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  FontAwesome5,
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const Order = ({ navigation, route }) => {
    const router = useRouter();
  const orderData = {
    amount: 1000,
    type: 'Buy',
    frequency: 'Monthly SIP',
    fundName: 'Nifty 50 Index Fund',
    units: 61.712,
    nav: 16.2036,
    navDate: '19 May, 2025',
    paymentStatus: 'successful',
    paymentDate: '17 May 2025, 09:17 PM',
    orderStatus: 'successful',
    orderDate: '20 May 2025, 12:17 AM',
    goals: [
      {
        name: 'New phone',
        target: '₹50,000',
        duration: '2 years',
        icon: 'cellphone',
      },
      {
        name: 'Dream',
        target: '₹100,000',
        duration: '3 years',
        icon: 'trophy',
      },
    ],
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'successful':
        return <Feather name="check-circle" size={20} color="#10B981" />;
      case 'pending':
        return <Feather name="clock" size={20} color="#F59E0B" />;
      case 'failed':
        return <Feather name="x-circle" size={20} color="#EF4444" />;
      default:
        return <Feather name="info" size={20} color="#6B7280" />;
    }
  };

  const renderStatusText = (status) => {
    switch (status) {
      case 'successful':
        return 'Payment successful';
      case 'pending':
        return 'Payment pending';
      case 'failed':
        return 'Payment failed';
      default:
        return status;
    }
  };

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={20} color="#1A365D" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.amount}>{orderData.amount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statusBadge}>
            {renderStatusIcon(orderData.paymentStatus)}
            <Text style={styles.statusText}>
              {renderStatusText(orderData.paymentStatus)}
            </Text>
          </View>
          
          <View style={styles.orderTypeContainer}>
            <View style={[
              styles.typeBadge,
              { backgroundColor: orderData.type === 'Buy' ? '#D1FAE5' : '#FEE2E2' }
            ]}>
              <MaterialCommunityIcons 
                name={orderData.type === 'Buy' ? 'arrow-up-bold-circle' : 'arrow-down-bold-circle'} 
                size={14} 
                color={orderData.type === 'Buy' ? '#10B981' : '#EF4444'} 
              />
              <Text style={[
                styles.typeText,
                { color: orderData.type === 'Buy' ? '#10B981' : '#EF4444' }
              ]}>
                {orderData.type}
              </Text>
            </View>
            <View style={styles.frequencyBadge}>
              <MaterialIcons name="repeat" size={14} color="#6B7280" />
              <Text style={styles.frequencyText}> • {orderData.frequency}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
        </View>

        {/* Fund Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fund Details</Text>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.fundCard}>
            <View style={styles.fundHeader}>
              <View style={styles.fundIcon}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#3B82F6" />
              </View>
              <View style={styles.fundInfo}>
                <Text style={styles.fundName}>{orderData.fundName}</Text>
                <Text style={styles.fundCategory}>Index Fund</Text>
              </View>
            </View>
            
            <View style={styles.fundDetails}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="chart-areaspline" size={16} color="#6B7280" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Units</Text>
                  <Text style={styles.detailValue}>{orderData.units.toFixed(3)}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <FontAwesome5 name="rupee-sign" size={14} color="#6B7280" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>NAV</Text>
                  <Text style={styles.detailValue}>₹{orderData.nav.toFixed(4)}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Feather name="calendar" size={16} color="#6B7280" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>NAV Date</Text>
                  <Text style={styles.detailValue}>{orderData.navDate}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                {renderStatusIcon('successful')}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Payment successful</Text>
                <Text style={styles.timelineDate}>{orderData.paymentDate}</Text>
              </View>
            </View>
            
            <View style={styles.timelineConnector} />
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                {renderStatusIcon('successful')}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Order successful</Text>
                <Text style={styles.timelineDate}>{orderData.orderDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryButton}>
            <MaterialCommunityIcons name="chart-line-variant" size={20} color="#1A365D" />
            <Text style={styles.secondaryButtonText}>View fund</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton}>
            <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Invest more</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <View style={styles.helpIcon}>
              <Feather name="help-circle" size={24} color="#6B7280" />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need help with your order?</Text>
              <Text style={styles.helpSubtitle}>Contact our support team</Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Feather name="phone" size={16} color="#1A365D" />
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  amountCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  frequencyText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    padding: 6,
  },
  viewAllText: {
    fontSize: 14,
    color: '#1A365D',
    fontWeight: '500',
  },
  fundCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  fundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  fundIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  fundCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  fundDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeline: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  timelineConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginLeft: 19,
    marginVertical: 4,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  goalTarget: {
    fontSize: 14,
    color: '#6B7280',
  },
  addGoalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  addGoalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A365D',
  },
  goalDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
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
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A365D',
  },
  helpSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  helpCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  helpIcon: {
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A365D',
  },
});

export default Order;