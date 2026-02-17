import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleMyApplications = ()=>{
    router.push("/myapplications")
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Gradient Header */}
        <LinearGradient
          colors={['#103d69', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#f0abfc', '#c084fc', '#a855f7']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>JD</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>Venu Verey</Text>
          <Text style={styles.profileEmail}>venu.verey@example.com</Text>
          
          <View style={styles.verificationBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#10b981" />
            <Text style={styles.verificationText}>Verified Account</Text>
          </View>
        </LinearGradient>

        {/* Modern Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#2563eb', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="wallet" size={20} color="#fff" />
            </View>
            <Text style={styles.statValue}>$12,450</Text>
            <Text style={styles.statLabel}>Total Balance</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#7c3aed', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="card" size={20} color="#fff" />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Cards</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#10b981', '#34d399']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={20} color="#fff" />
            </View>
            <Text style={styles.statValue}>$8,200</Text>
            <Text style={styles.statLabel}>Investments</Text>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={handleMyApplications} style={styles.actionButton}>
              <LinearGradient
                colors={['#f0f9ff', '#e0f2fe']}
                style={styles.actionButtonInner}
              >
                <Ionicons name="add-circle" size={24} color="#103d69" />
              </LinearGradient>
              <Text style={styles.actionText}>My Applications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#fef7ff', '#fae8ff']}
                style={styles.actionButtonInner}
              >
                <Ionicons name="receipt" size={24} color="#103d69" />
              </LinearGradient>
              <Text style={styles.actionText}>Statements</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#fff7ed', '#ffedd5']}
                style={styles.actionButtonInner}
              >
                <Ionicons name="qr-code" size={24} color="#103d69" />
              </LinearGradient>
              <Text style={styles.actionText}>QR Code</Text>
            </TouchableOpacity>
          </View>

          {/* Account Settings */}
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <MenuItem 
            icon="person-outline" 
            title="Personal Information" 
            color="#103d69"
            badge="Complete"
          />
          <MenuItem 
            icon="shield-checkmark-outline" 
            title="Security & Privacy" 
            color="#103d69"
            showChevron={true}
          />
          <MenuItem 
            icon="notifications-outline" 
            title="Notifications" 
            color="#103d69"
            showSwitch={true}
            enabled={true}
          />
          <MenuItem 
            icon="card-outline" 
            title="Payment Methods" 
            color="#103d69"
            showChevron={true}
          />

          {/* Preferences */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <MenuItem 
            icon="moon-outline" 
            title="Dark Mode" 
            color="#103d69"
            showSwitch={true}
            enabled={false}
          />
          <MenuItem 
            icon="language-outline" 
            title="Language" 
            color="#103d69"
            subtitle="English"
            showChevron={true}
          />
          <MenuItem 
            icon="globe-outline" 
            title="Currency" 
            color="#103d69"
            subtitle="USD"
            showChevron={true}
          />

          {/* Support */}
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem 
            icon="help-circle-outline" 
            title="Help Center" 
            color="#103d69"
            showChevron={true}
          />
          <MenuItem 
            icon="call-outline" 
            title="Contact Support" 
            color="#103d69"
            badge="24/7"
            showChevron={true}
          />
          <MenuItem 
            icon="document-text-outline" 
            title="Terms & Conditions" 
            color="#64748b"
            showChevron={true}
          />
          <MenuItem 
            icon="shield-outline" 
            title="Privacy Policy" 
            color="#475569"
            showChevron={true}
          />

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <LinearGradient
              colors={['#103d69', '#103d69']}
              style={styles.logoutButtonInner}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Log Out</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.versionText}>Version 2.4.1</Text>
            <Text style={styles.copyrightText}>© 2024 FinBank. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title, subtitle, color, badge, showSwitch, showChevron, enabled }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <LinearGradient
          colors={[color + '15', color + '10']}
          style={[styles.menuIcon, { borderColor: color + '30' }]}
        >
          <Ionicons name={icon} size={22} color={color} />
        </LinearGradient>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.menuRight}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.badgeText, { color: color }]}>{badge}</Text>
          </View>
        )}
        {showSwitch && (
          <View style={[styles.switch, enabled && styles.switchActive]}>
            <View style={[styles.switchThumb, enabled && styles.switchThumbActive]} />
          </View>
        )}
        {showChevron && (
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileHeader: {
    paddingTop: 15,
    paddingBottom: 40,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#7c3aed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  verificationText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -40,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#10b981',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  logoutButton: {
    marginTop: 32,
    marginBottom: 20,
  },
  logoutButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
  },
  versionText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});