import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  isPassword,
  keyboardType = 'default',
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && (
          <Ionicons name={icon} size={22} color="#666" style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 0, // No border, using shadow
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
  },
  icon: {
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
});
