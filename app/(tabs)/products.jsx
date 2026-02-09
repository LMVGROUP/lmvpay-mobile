import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 

export default function ProductsScreen() {
  const router = useRouter();

  const handleProductPress = (productName,productType) => {
    // Navigate to product details screen
    console.log(productName,productType)
    router.push(`/products/${productType}/${productName}`);
  };

  const handleExpertChat = () => {
    // Navigate to expert chat screen
    router.push('/expert-chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#103d69', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Financial Products</Text>
          <Text style={styles.subtitle}>Explore our premium offerings</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24+</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Insurance Products</Text>

        <ProductCard
          icon="car"
          title="Car Insurance"
          description="Comprehensive car insurance plans"
          color="#3b82f6"
          gradient={['#3b82f6', '#60a5fa']}
          onPress={() => handleProductPress('car-insurance')}
        />

        <ProductCard
          icon="bicycle"
          title="Bike Insurance"
          description="Affordable two-wheeler insurance"
          color="#f59e0b"
          gradient={['#f59e0b', '#fbbf24']}
          onPress={() => handleProductPress('bike-insurance')}
        />

        <ProductCard
          icon="medkit"
          title="Health Insurance"
          description="Family health insurance coverage"
          color="#10b981"
          gradient={['#10b981', '#34d399']}
          badge="Recommended"
          onPress={() => handleProductPress('health','insurance')}
        />

        <ProductCard
          icon="business"
          title="Commercial Insurance"
          description="Business and commercial property insurance"
          color="#6366f1"
          gradient={['#6366f1', '#818cf8']}
          onPress={() => handleProductPress('commercial-insurance')}
        />

        <ProductCard
          icon="medal"
          title="Personal Accident"
          description="Accidental death and disability cover"
          color="#ec4899"
          gradient={['#ec4899', '#f472b6']}
          onPress={() => handleProductPress('pa','insurance')}
        />
        <Text style={styles.sectionTitle}>Loan Products</Text>

        <ProductCard
          icon="home"
          title="Home Loan"
          description="Buy your dream home with attractive rates"
          color="#ef4444"
          gradient={['#ef4444', '#f87171']}
          badge="Lowest Rate"
          onPress={() => handleProductPress('home','loan')}
        />

        <ProductCard
          icon="business"
          title="LAP Loan"
          description="Loan Against Property for business needs"
          color="#8b5cf6"
          gradient={['#8b5cf6', '#a78bfa']}
          onPress={() => handleProductPress('lap','loan')}
        />
         <ProductCard
          icon="briefcase"
          title="Business Loans"
          description="Growth capital for businesses"
          color="#7c3aed"
          gradient={['#7c3aed', '#8b5cf6']}
          onPress={() => handleProductPress('business','loan')}
        />

        <ProductCard
          icon="person"
          title="Personal Loan"
          description="Quick personal loans for all needs"
          color="#06b6d4"
          gradient={['#06b6d4', '#22d3ee']}
          badge="Instant"
          onPress={() => handleProductPress('personal','loan')}
        />


        <Text style={styles.sectionTitle}>Featured Products</Text>

        <ProductCard
          icon="card"
          title="Credit Cards"
          description="Premium cards with exclusive rewards"
          color="#2563eb"
          gradient={['#2563eb', '#3b82f6']}
          badge="Popular"
          onPress={() => handleProductPress('credit-cards')}
        />

        <ProductCard
          icon="trending-up"
          title="Smart Investments"
          description="AI-powered investment portfolios"
          color="#10b981"
          gradient={['#10b981', '#34d399']}
          badge="New"
          onPress={() => handleProductPress('mf','investments')}
        />

        <ProductCard
          icon="shield-checkmark"
          title="Insurance Plus"
          description="Comprehensive coverage plans"
          color="#f59e0b"
          gradient={['#f59e0b', '#fbbf24']}
          onPress={() => handleProductPress('insurance')}
        />

       




        <View style={styles.banner}>
          <Ionicons name="sparkles" size={24} color="#fbbf24" />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Need help choosing?</Text>
            <Text style={styles.bannerSubtitle}>Get personalized recommendations</Text>
          </View>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={handleExpertChat}
          >
            <Text style={styles.bannerButtonText}>Talk to Expert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductCard({ icon, title, description, gradient, badge, onPress }) {
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={28} color="#fff" />
      </LinearGradient>
      <View style={styles.productInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.productTitle}>{title}</Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: gradient[0] + '20' }]}>
              <Text style={[styles.badgeText, { color: gradient[0] }]}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.productDescription}>{description}</Text>
      </View>
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#103d69',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    marginTop: 8,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chevronContainer: {
    padding: 8,
  },
  banner: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bannerButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});