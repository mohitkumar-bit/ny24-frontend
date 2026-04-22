import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Plan {
  id: 'free' | 'pro' | 'business';
  name: string;
  price: string;
  priceLabel: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    priceLabel: 'Free',
    color: '#000',
    features: [
      '5 active posts',
      'Basic search placement',
      '7-day visibility',
      'Standard support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹299',
    priceLabel: '₹299/month',
    isPopular: true,
    color: '#FF9500',
    features: [
      '50 active posts',
      'Priority placement',
      '30-day visibility',
      '3 featured posts/month',
      'Analytics dashboard',
      'Priority support'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹799',
    priceLabel: '₹799/month',
    color: '#000',
    features: [
      'Unlimited posts',
      'Top search placement',
      'Always visible',
      'Unlimited featured posts',
      'Advanced analytics',
      'Dedicated manager',
      'Custom branding'
    ]
  }
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'business'>('pro');

  const activePlan = PLANS.find(p => p.id === selectedPlan)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#FFF8EE', '#FFFFFF']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroIconContainer}>
            <LinearGradient
              colors={['#FF9500', '#FFD200']}
              style={styles.heroIcon}
            >
              <Ionicons name="ribbon" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Choose Your Plan</Text>
          <Text style={styles.heroSubtitle}>Unlock priority placement, more ads, and Pro badge</Text>
        </View>

        {/* Pricing Cards */}
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && { borderColor: plan.color, borderWidth: 2 }
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.9}
              >
                {plan.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>POPULAR</Text>
                  </View>
                )}

                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.planName, isSelected && { color: plan.color }]}>{plan.name}</Text>
                    <Text style={[styles.planPrice, isSelected && { color: plan.color }]}>
                      {plan.priceLabel}
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, isSelected && { borderColor: plan.color }]}>
                    {isSelected && <View style={[styles.radioInner, { backgroundColor: plan.color }]} />}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={styles.checkIcon}>
                        <Ionicons name="checkmark-circle" size={20} color="#00A300" />
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.subscribeBtn} activeOpacity={0.8}>
          <Text style={styles.subscribeBtnText}>
            {selectedPlan === 'free' ? 'Continue with Free' : `Subscribe to ${activePlan.name} - ${activePlan.price}/mo`}
          </Text>
        </TouchableOpacity>
        <Text style={styles.footerDisclaimer}>Cancel anytime • No real payment in demo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
    position: 'relative',
  },
  heroIconContainer: {
    marginBottom: 20,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    maxWidth: '80%',
    opacity: 0.8,
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 10,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 24,
    left: 70,
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  featureText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  subscribeBtn: {
    backgroundColor: '#00A300',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerDisclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 12,
    fontWeight: '500',
  },
});
