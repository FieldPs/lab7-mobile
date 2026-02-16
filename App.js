import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileScreen from './components/ProfileScreen';
import CurrencyConverter from './components/CurrencyConverter';
import BookNavigator from './components/BookNavigator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('profile');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileScreen />;
      case 'currency':
        return <CurrencyConverter />;
      case 'book':
        return <BookNavigator />;
      default:
        return <ProfileScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        {renderScreen()}
      </View>

      <View style={styles.tabBar}>
        <Pressable 
          style={[styles.tabItem, currentScreen === 'profile' && styles.activeTab]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>Profile</Text>
        </Pressable>
        <Pressable 
          style={[styles.tabItem, currentScreen === 'currency' && styles.activeTab]}
          onPress={() => setCurrentScreen('currency')}
        >
          <Text style={[styles.tabText, currentScreen === 'currency' && styles.activeTabText]}>Currency</Text>
        </Pressable>
        <Pressable 
          style={[styles.tabItem, currentScreen === 'book' && styles.activeTab]}
          onPress={() => setCurrentScreen('book')}
        >
          <Text style={[styles.tabText, currentScreen === 'book' && styles.activeTabText]}>Book</Text>
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
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
