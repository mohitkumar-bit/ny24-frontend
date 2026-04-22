import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Base height + safe area bottom inset (gesture bar / home indicator)
  const tabBarHeight = 60 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00A300',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, // respect gesture bar
          paddingTop: 5,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: 'absolute',
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: 'Workers',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="people-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="chatbubbles-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}