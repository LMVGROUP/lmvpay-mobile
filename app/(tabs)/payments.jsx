import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Compact Header */}
      <LinearGradient
        colors={['#103d69', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>Payments</Text>
            <Text style={styles.subtitle}>Manage your finances</Text>
          </View>
          
        </View>

        {/* Compact Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceInfo}>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>$12,450.00</Text>
            </View>
            <TouchableOpacity style={styles.eyeButton}>
              <Ionicons name="eye-outline" size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="arrow-up-circle" size={18} color="#2563eb" />
              <Text style={styles.secondaryButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Overview - More Compact */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down-circle" size={16} color="#10b981" />
            <Text style={[styles.statValue, styles.positive]}>+$3,500</Text>
            <Text style={styles.statLabel}>Income</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={16} color="#ef4444" />
            <Text style={[styles.statValue, styles.negative]}>-$950</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={16} color="#f59e0b" />
            <Text style={[styles.statValue, styles.positive]}>+$2,550</Text>
            <Text style={styles.statLabel}>Savings</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsGrid}>
          <ActionItem 
            icon="phone-portrait" 
            label="Recharge" 
            color="#103d69"
            compact={true}
          />
          <ActionItem 
            icon="card" 
            label="Bills" 
            color="#103d69"
            badge="3"
            compact={true}
          />
          <ActionItem 
            icon="qr-code" 
            label="Scan" 
            color="#103d69"
            compact={true}
          />
          <ActionItem 
            icon="repeat" 
            label="Transfer" 
            color="#103d69"
            compact={true}
          />
          <ActionItem 
            icon="trending-up" 
            label="Invest" 
            color="#103d69"
            compact={true}
          />
          <ActionItem 
            icon="shield-checkmark" 
            label="Insurance" 
            color="#103d69"
            compact={true}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#2563eb" />
          </TouchableOpacity>
        </View>
        
        <TransactionItem
          icon="cart"
          title="Amazon Purchase"
          category="Shopping"
          date="Today, 2:30 PM"
          amount="-$45.99"
          type="debit"
          compact={true}
        />
        <TransactionItem
          icon="arrow-down-circle"
          title="Salary Credit"
          category="Income"
          date="Yesterday, 9:00 AM"
          amount="+$3,500.00"
          type="credit"
          compact={true}
        />
        <TransactionItem
          icon="cafe"
          title="Starbucks"
          category="Food & Drinks"
          date="Jan 17, 4:15 PM"
          amount="-$8.50"
          type="debit"
          compact={true}
        />
        <TransactionItem
          icon="phone-portrait"
          title="Mobile Recharge"
          category="Utilities"
          date="Jan 16, 11:30 AM"
          amount="-$25.00"
          type="debit"
          compact={true}
        />
        <TransactionItem
          icon="car"
          title="Uber Ride"
          category="Transport"
          date="Jan 15, 7:30 PM"
          amount="-$18.75"
          type="debit"
          compact={true}
        />

        {/* Upcoming Bills Banner */}
        <TouchableOpacity style={styles.billsCard}>
          <LinearGradient
            colors={['#fef3c7', '#fed7aa']}
            style={styles.billsGradient}
          >
            <View style={styles.billsContent}>
              <View style={styles.billsInfo}>
                <Ionicons name="alert-circle" size={20} color="#ea580c" />
                <View style={styles.billsText}>
                  <Text style={styles.billsTitle}>2 Bills Due in 3 Days</Text>
                  <Text style={styles.billsSubtitle}>Credit Card & Electricity</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ea580c" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Investment Opportunity */}
        <View style={styles.investmentCard}>
          <LinearGradient
            colors={['#dbeafe', '#eff6ff']}
            style={styles.investmentGradient}
          >
            <View style={styles.investmentContent}>
              <Ionicons name="trending-up" size={24} color="#2563eb" />
              <View style={styles.investmentText}>
                <Text style={styles.investmentTitle}>Smart Investment</Text>
                <Text style={styles.investmentSubtitle}>Earn up to 8.5% returns</Text>
              </View>
              <TouchableOpacity style={styles.investButton}>
                <Text style={styles.investButtonText}>Invest Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Recent Contacts */}
        <Text style={styles.sectionTitle}>Recent Contacts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.contactsScroll}
        >
          <ContactItem name="John Doe" phone="+1 234 567 890" />
          <ContactItem name="Sarah Smith" phone="+1 987 654 321" />
          <ContactItem name="Mike Wilson" phone="+1 456 789 012" />
          <ContactItem name="Add New" isAdd={true} />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionItem({ icon, label, color, badge, compact }) {
  return (
    <TouchableOpacity style={[styles.actionItem, compact && styles.actionItemCompact]}>
      <View style={[styles.actionIcon, { backgroundColor: color + '15' }, compact && styles.actionIconCompact]}>
        <Ionicons name={icon} size={compact ? 20 : 24} color={color} />
      </View>
      <View style={styles.actionLabelContainer}>
        <Text style={[styles.actionLabel, compact && styles.actionLabelCompact]}>{label}</Text>
        {badge && (
          <View style={[styles.actionBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.actionBadgeText, { color: color }]}>{badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function TransactionItem({ icon, title, category, date, amount, type, compact }) {
  return (
    <TouchableOpacity style={[styles.transactionItem, compact && styles.transactionItemCompact]}>
      <View style={[styles.transactionIcon, { backgroundColor: type === 'credit' ? '#dcfce7' : '#fee2e2' }, compact && styles.transactionIconCompact]}>
        <Ionicons 
          name={icon} 
          size={compact ? 18 : 22} 
          color={type === 'credit' ? '#10b981' : '#ef4444'} 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionTitle, compact && styles.transactionTitleCompact]}>{title}</Text>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionCategory, compact && styles.transactionCategoryCompact]}>{category}</Text>
          <Text style={[styles.transactionDate, compact && styles.transactionDateCompact]}>{date}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          compact && styles.transactionAmountCompact,
          type === 'credit' ? styles.creditAmount : styles.debitAmount,
        ]}>
        {amount}
      </Text>
    </TouchableOpacity>
  );
}

function ContactItem({ name, phone, isAdd }) {
  if (isAdd) {
    return (
      <TouchableOpacity style={styles.contactItem}>
        <View style={[styles.contactAvatar, { backgroundColor: '#e2e8f0' }]}>
          <Ionicons name="add" size={24} color="#64748b" />
        </View>
        <Text style={styles.contactName}>Add New</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.contactItem}>
      <View style={[styles.contactAvatar, { backgroundColor: '#93c5fd' }]}>
        <Text style={styles.contactAvatarText}>{name.charAt(0)}</Text>
      </View>
      <Text style={styles.contactName}>{name}</Text>
      <Text style={styles.contactPhone}>{phone}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 13,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  notificationButton: {
    position: 'relative',
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#1e293b',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  eyeButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#103d69',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  actionItem: {
    width: '31%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  actionItemCompact: {
    padding: 10,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconCompact: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginBottom: 6,
  },
  actionLabelContainer: {
    alignItems: 'center',
    minHeight: 30,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  actionLabelCompact: {
    fontSize: 11,
  },
  actionBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  actionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  transactionItemCompact: {
    padding: 12,
    marginBottom: 6,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  transactionTitleCompact: {
    fontSize: 14,
    marginBottom: 1,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionCategoryCompact: {
    fontSize: 11,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  transactionDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  transactionDateCompact: {
    fontSize: 10,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  transactionAmountCompact: {
    fontSize: 14,
  },
  creditAmount: {
    color: '#10b981',
  },
  debitAmount: {
    color: '#ef4444',
  },
  billsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  billsGradient: {
    padding: 16,
  },
  billsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  billsText: {
    flex: 1,
  },
  billsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 2,
  },
  billsSubtitle: {
    fontSize: 12,
    color: '#b45309',
  },
  investmentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  investmentGradient: {
    padding: 16,
  },
  investmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  investmentText: {
    flex: 1,
  },
  investmentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 2,
  },
  investmentSubtitle: {
    fontSize: 12,
    color: '#3b82f6',
  },
  investButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  investButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  contactsScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  contactName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});