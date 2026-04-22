import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 100 }: LogoProps) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.25 }]}>
      <Text style={[styles.text, { fontSize: size * 0.5 }]}>G</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF8C00', // Brand Orange
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF', // White text
    fontWeight: '700',
    fontFamily: 'System', 
  },
});
