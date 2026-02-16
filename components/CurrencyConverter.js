import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';

export default function CurrencyConverter() {
  const [thb, setThb] = useState('');

  const rates = {
    USD: 0.028,
    JPY: 4.25,
    EUR: 0.026,
  };

  const calculate = (amount, rate) => {
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
            placeholderTextColor="#666" 
            keyboardType="numeric"
            value={thb}
            onChangeText={setThb}
          />

          <View style={styles.resultContainer}>
            <View style={styles.resultRow}>
              <Text style={styles.currencyCode}>🇺🇸 USD</Text>
              <Text style={styles.currencyValue}>{calculate(thb, rates.USD)} USD</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.resultRow}>
              <Text style={styles.currencyCode}>🇯🇵 JPY</Text>
              <Text style={styles.currencyValue}>{calculate(thb, rates.JPY)} JPY</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.resultRow}>
              <Text style={styles.currencyCode}>🇪🇺 EUR</Text>
              <Text style={styles.currencyValue}>{calculate(thb, rates.EUR)} EUR</Text>
            </View>
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
    // High opacity white background for better contrast
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Dark text
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333', // Dark text
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(240, 240, 240, 0.8)', // Light grey input bg
    borderRadius: 12,
    padding: 15,
    color: '#333', // Dark text
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: 'white',
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
    color: '#444', 
  },
  currencyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', 
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
});
