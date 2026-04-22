import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title]}>NY24</Text>
        <Text style={styles.subtitle}>unbox the box of opportunities</Text>
      </View>
      <TouchableOpacity style={styles.notificationBtn}>
        <Ionicons name="notifications" size={24} color="#000" />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: '#00A300',
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontFamily: "Inter_700Bold"
  },
  notificationBtn: {
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
