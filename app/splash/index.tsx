import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/Logo';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to Login after 2 seconds
    const timer = setTimeout(() => {
      router.replace("/auth/login" as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />

      <View style={styles.content}>
        <Logo size={80} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>NY24</Text>
          <Text style={styles.subtitle}>unbox the box of opportunities</Text>
        </View>

        <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00', // Vibrant orange
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 5,
  },
  loader: {
    marginTop: 50,
  },
});
