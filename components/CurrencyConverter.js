import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';

const CurrencyItem = ({ label, value, flag }) => (
  <View style={styles.resultRow}>
    <Text style={styles.currencyCode}>{flag} {label}</Text>
    <Text style={styles.currencyValue}>{value} {label}</Text>
  </View>
);

export default function CurrencyConverter() {
  const [thb, setThb] = useState('');

  const rates = {
    USD: 0.028,
    JPY: 4.25,
    EUR: 0.026,
  };

  const calculate = (amount, rate) => {
    // C1: Logic Check
    if (!amount) return '0.00';
    const value = parseFloat(amount);
    if (isNaN(value)) return '0.00';
    return (value * rate).toFixed(2);
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://i.pinimg.com/736x/8f/a0/04/8fa00416df993b4825902b36c2e39542.jpg' }} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.glassCard}>
          <Text style={styles.title}>Currency Converter</Text>
          
          <Text style={styles.label}>Thai Baht (THB)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#444444ff" 
            keyboardType="decimal-pad"
            value={thb}
            onChangeText={setThb}
          />

          <View style={styles.resultContainer}>
            <CurrencyItem 
              label="USD" 
              value={calculate(thb, rates.USD)} 
              flag="🇺🇸" 
            />
            <View style={styles.divider} />
            <CurrencyItem 
              label="JPY" 
              value={calculate(thb, rates.JPY)} 
              flag="🇯🇵" 
            />
            <View style={styles.divider} />
            <CurrencyItem 
              label="EUR" 
              value={calculate(thb, rates.EUR)} 
              flag="🇪🇺" 
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCard: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8, // C2: Elevation > 5
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 12,
    padding: 15,
    color: '#333',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Less opaque to blend better
    borderRadius: 15,
    padding: 10,
    elevation: 2,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', 
  },
  currencyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', 
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 10,
  },
});
