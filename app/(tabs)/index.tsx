import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
const handleFundPress = () => {
    router.push('/products/investments/mf');
  };

  const handleInsurancePress = (label: string) => {
    const routes: { [key: string]: string } = {
      Life: '/products/insurance/life',
      Bike: '/products/insurance/bike',
      Health: '/products/insurance/health',
      pa: '/products/insurance/pa',
    };

    const path = routes[label];
    if (path) {
      router.push(path);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#103d69', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="menu" size={24} color="#fff" />
              <Text style={styles.headerTitle}>Banking Services</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.promoCard}>
            <Text style={styles.promoTitle}>Just For{'\n'}New Users</Text>
            <Text style={styles.promoSubtitle}>
              Join Us Now and Get $500 Bonus*
            </Text>
            <Text style={styles.promoTerms}>Apple Terms & Conditions*</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Download Our App</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recharge & Bill</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.serviceGrid}>
              <ServiceItem icon="phone-portrait" label="Mobile Recharge" />
              <ServiceItem icon="wifi" label="Wi-Fi Recharge" />
              <ServiceItem icon="flash" label="E-Bill Recharge" />
              <ServiceItem icon="water" label="Water Bill Recharge" />
              <ServiceItem icon="pricetag" label="Fast Tag Recharge" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.featureCard}>
              <Text style={styles.interestRate}>Interest rate starts @6%</Text>
              <Ionicons
                name="cash-outline"
                size={48}
                color="#103d69"
                style={styles.featureIcon}
              />
              <Text style={styles.featureTitle}>Loans</Text>
              <Text style={styles.featureSubtitle}>Free credit scores</Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureLabel}>Travel</Text>
              <Ionicons
                name="airplane-outline"
                size={48}
                color="#103d69"
                style={styles.featureIcon}
              />
              <Text style={styles.featureSubtitle}>Free credit scores</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Silver & gold</Text>
              <Ionicons
                name="diamond-outline"
                size={48}
                color="#103d69"
                style={styles.featureIcon}
              />
              <Text style={styles.featureSubtitle}>Free credit scores</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Insurance</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.insuranceGrid}>
              <InsuranceItem
                icon="shield-checkmark"
                label="Life"
                onPress={() => handleInsurancePress('Life')}
              />
              <InsuranceItem
                icon="bicycle"
                label="Bike"
                onPress={() => handleInsurancePress('Bike')}
              />
              <InsuranceItem
                icon="medkit-outline"
                label="Health"
                onPress={() => handleInsurancePress('Health')}
              />
              <InsuranceItem
                icon="body-outline"
                label="PA"
                onPress={() => handleInsurancePress('pa')}
              />
            </View>
          </View>

          {/* Top Mutual Funds - Grid Layout (2x2) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Mutual Funds</Text>
              <TouchableOpacity onPress={handleFundPress}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mutualFundGrid}>
              <MutualFundCard
                image="https://equity-documents.s3.ap-south-1.amazonaws.com/UTI_MF.png"
                name="UTI Nifty 50 Index Fund"
                growth="+18.5%"
              />
              <MutualFundCard
                image="https://assets-netstorage.groww.in/mf-assets/logos/icici_groww.png"
                name="ICICI Long Term Equity Fund"
                growth="+22.3%"
              />
              <MutualFundCard
                image="https://equity-documents.s3.ap-south-1.amazonaws.com/axis.png"
                name="Axis Gold Fund"
                growth="+15.2%"
              />
              <MutualFundCard
                image="https://assets-netstorage.groww.in/mf-assets/logos/mirae_groww.png"
                name="MIRAE Asset Healthcare Fund"
                growth="+24.8%"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cards</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}>
              <CreditCard
                type="debit"
                colors={['#ec4899', '#a855f7']}
                number="1234 5678 1234 5678"
              />
              <CreditCard
                type="credit"
                colors={['#1f2937', '#374151']}
                number="4532 3189 9999 1049"
              />
            </ScrollView>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Cashback & Offers</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.cashbackCard}>
                <View style={styles.lottieContainer}>
                  <LottieView
                    source={require('../../assets/animations/GiftPremium.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                </View>
                <View style={styles.cashbackInfo}>
                  <Text style={styles.cashbackTitle}>Premium Cashback</Text>
                  <Text style={styles.cashbackSubtitle}>Exclusive offers waiting</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8b5cf6" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function ServiceItem({ icon, label }: { icon: any; label: string }) {
  return (
    <TouchableOpacity style={styles.serviceItem}>
      <View style={styles.serviceIconContainer}>
        <Ionicons name={icon} size={28} color="#103d69" />
      </View>
      <Text style={styles.serviceLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function InsuranceItem({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.insuranceItem} onPress={onPress}>
      <View style={styles.insuranceIconContainer}>
        <Ionicons name={icon} size={32} color="#103d69" />
      </View>
      <Text style={styles.insuranceLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function MutualFundCard({ image, name, growth }: { image: string; name: string; growth: string }) {
  const router = useRouter();

  const handleFundPress = () => {
    router.push('/products/investments/mf');
  };

  return (
    <TouchableOpacity style={styles.mutualFundCard} onPress={handleFundPress}>
      <View style={styles.mutualFundHeader}>
        <View style={styles.mutualFundImageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.mutualFundImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.growthBadge}>
          <Text style={styles.growthText}>{growth}</Text>
        </View>
      </View>
      <Text style={styles.mutualFundName} numberOfLines={2}>{name}</Text>
      <View style={styles.fundFooter}>
        <Text style={styles.fundType}>Equity</Text>
        <View style={styles.investNowBadge}>
          <Text style={styles.investNowText}>Invest</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CreditCard({
  type,
  colors,
  number,
}: {
  type: string;
  colors: [string, string];
  number: string;
}) {
  return (
    <LinearGradient colors={colors} style={styles.creditCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{type}</Text>
        <Text style={styles.cardBank}>BANK</Text>
      </View>
      <View style={styles.cardChip} />
      <Text style={styles.cardNumber}>{number}</Text>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>VALID THRU</Text>
          <Text style={styles.cardValue}>12/26</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>CARDHOLDER NAME</Text>
        </View>
      </View>
      {type === 'credit' && (
        <Ionicons
          name="wifi"
          size={20}
          color="#fff"
          style={styles.contactlessIcon}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  cashbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  lottieContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  cashbackInfo: {
    flex: 1,
  },
  cashbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  cashbackSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  heroSection: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    marginBottom: 8,
  },
  promoSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  promoTerms: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 16,
  },
  downloadButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  downloadButtonText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceGrid: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceItem: {
    width: (width - 64) / 5,
    alignItems: 'center',
    padding: 4,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  interestRate: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  featureIcon: {
    marginVertical: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  insuranceGrid: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insuranceItem: {
    alignItems: 'center',
    width: 70,
  },
  insuranceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  insuranceLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  // Mutual Funds Grid Styles (2x2 layout)
  mutualFundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  mutualFundCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 12,
  },
  mutualFundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mutualFundImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  mutualFundImage: {
    width: '100%',
    height: '100%',
  },
  growthBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growthText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  mutualFundName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 12,
    height: 40,
  },
  fundFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  fundType: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  investNowBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  investNowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Credit Card Styles
  creditCard: {
    width: width - 80,
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardBank: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cardChip: {
    width: 48,
    height: 36,
    backgroundColor: '#fbbf24',
    borderRadius: 6,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    marginBottom: 2,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contactlessIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  offersRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  offerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  offerText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});