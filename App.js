import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, StatusBar } from 'react-native';
import ProfileScreen from './components/ProfileScreen';
import CurrencyConverter from './components/CurrencyConverter';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('profile');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        {currentScreen === 'profile' ? <ProfileScreen /> : <CurrencyConverter />}
      </View>

      <View style={styles.tabBar}>
        <Pressable 
          style={[styles.tabItem, currentScreen === 'profile' && styles.activeTab]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>Profile</Text>
        </Pressable>
        <Pressable 
          style={[styles.tabItem, currentScreen === 'converter' && styles.activeTab]}
          onPress={() => setCurrentScreen('converter')}
        >
          <Text style={[styles.tabText, currentScreen === 'converter' && styles.activeTabText]}>Converter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'center',
    paddingBottom: 0, 
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#4F46E5',
    backgroundColor: '#F3F4F6',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
