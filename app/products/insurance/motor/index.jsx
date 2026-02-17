import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const PRIMARY_COLOR = "#103d69"
const LIGHT_BG = "#f5f7fa"

const index = () => {
  const router = useRouter()
  
  const products = [
    {
      id: 1,
      name: "Car Insurance",
      icon: "car",
      iconType: "FontAwesome5",
      iconColor: "#4CAF50",
      description: "Comprehensive coverage for your personal vehicles",
      features: ["Third Party Liability", "Own Damage", "Personal Accident"],
      price: "Starting at ₹2,094/year",
      route: "/products/insurance/motor/CarForm" // Car insurance goes to CarForm
    },
    {
      id: 2,
      name: "Bike Insurance",
      icon: "motorcycle",
      iconType: "FontAwesome5", 
      iconColor: "#FF9800",
      description: "Protection for your two-wheeler",
      features: ["Third Party", "Own Damage", "Roadside Assistance"],
      price: "Starting at ₹537/year",
      route: "/products/insurance/motor/BikeForm" // You'll need to create this
    },
    {
      id: 3,
      name: "Commercial Vehicle",
      icon: "truck",
      iconType: "FontAwesome5",
      iconColor: "#2196F3",
      description: "Fleet and commercial vehicle coverage",
      features: ["Goods Carrying", "Passenger Carrying", "Liability Cover"],
      price: "Custom quotes available",
      route: "/products/insurance/motor/CommercialForm" // You'll need to create this
    }
  ]

  const getIcon = (product) => {
    switch(product.iconType) {
      case "FontAwesome5":
        return <FontAwesome5 name={product.icon} size={28} color={product.iconColor} />
      default:
        return <FontAwesome5 name={product.icon} size={28} color={product.iconColor} />
    }
  }

  // Handle card press navigation - navigates to respective form
  const handleCardPress = (product) => {
    router.push({
      pathname: product.route,
      params: { 
        id: product.id, 
        name: product.name,
        price: product.price,
        fromScreen: "motor-insurance"
      }
    })
  }

  // Handle buy now button press - also navigates to respective form
  const handleBuyNow = (product, e) => {
    // Stop propagation to prevent triggering card's onPress
    e?.stopPropagation()
    
    router.push({
      pathname: product.route, // Use the same route as card press
      params: { 
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        action: "buyNow",
        fromScreen: "motor-insurance"
      }
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with Back Navigation */}
      <View style={{ 
        backgroundColor: PRIMARY_COLOR, 
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
          Motor Insurance
        </Text>
      </View>

      {/* Hero Banner */}
      <View style={{
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}>
        <Text style={{ 
          color: '#fff', 
          fontSize: 22, 
          fontWeight: 'bold',
          marginBottom: 6
        }}>
          Drive with Confidence
        </Text>
        <Text style={{ 
          color: '#fff', 
          fontSize: 14,
          opacity: 0.9,
          marginBottom: 16
        }}>
          Choose from our range of motor insurance products
        </Text>
        
        {/* Quick Stats */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 12,
          padding: 12
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>1M+</Text>
            <Text style={{ color: '#fff', fontSize: 11, opacity: 0.9 }}>Happy Customers</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>24/7</Text>
            <Text style={{ color: '#fff', fontSize: 11, opacity: 0.9 }}>Claim Support</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>100%</Text>
            <Text style={{ color: '#fff', fontSize: 11, opacity: 0.9 }}>Digital Process</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: LIGHT_BG }}
      >
        {/* Products Section */}
        <View style={{ padding: 16 }}>
          {products.map((product) => (
            <TouchableOpacity 
              key={product.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2
              }}
              onPress={() => handleCardPress(product)} // Navigate to respective form
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{
                  backgroundColor: `${product.iconColor}15`,
                  padding: 10,
                  borderRadius: 10,
                  marginRight: 12
                }}>
                  {getIcon(product)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: PRIMARY_COLOR }}>
                    {product.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    {product.description}
                  </Text>
                </View>
              </View>

              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                marginBottom: 10,
                gap: 6
              }}>
                {product.features.map((feature, index) => (
                  <View key={index} style={{
                    backgroundColor: LIGHT_BG,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 16
                  }}>
                    <Text style={{ fontSize: 11, color: PRIMARY_COLOR }}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 6,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: '#eee'
              }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: PRIMARY_COLOR }}>
                  {product.price}
                </Text>
                <TouchableOpacity 
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20
                  }}
                  onPress={(e) => handleBuyNow(product, e)} // Navigate to respective form with buy now action
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default index