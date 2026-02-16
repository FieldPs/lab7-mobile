import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import api from '../utils/api'; // Custom axios instance

const { width } = Dimensions.get('window');

const WeatherCard = ({ data, loading, error }) => {
  if (loading) return <View style={styles.card}><ActivityIndicator size="small" color="#4F46E5" /></View>;
  if (error) return <View style={[styles.card, styles.errorCard]}><Text style={styles.errorText}>Failed to load Weather</Text></View>;
  
  if (!data) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Weather (Bangkok)</Text>
      <View style={styles.row}>
        <Text style={styles.temp}>{data.current_weather?.temperature}°C</Text>
        <Text style={styles.subText}>Wind: {data.current_weather?.windspeed} km/h</Text>
      </View>
      {data.fromCache && <Text style={styles.cacheLabel}>📱 Offline Mode (Cached)</Text>}
    </View>
  );
};

const CryptoCard = ({ data, loading, error }) => {
  if (loading) return <View style={styles.card}><ActivityIndicator size="small" color="#4F46E5" /></View>;
  if (error) return <View style={[styles.card, styles.errorCard]}><Text style={styles.errorText}>Failed to load Crypto</Text></View>;

  if (!data) return null;

  const btc = data.bitcoin;
  
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Crypto Market</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Bitcoin (BTC)</Text>
        <Text style={styles.value}>${btc?.usd?.toLocaleString()}</Text>
      </View>
      {data.fromCache && <Text style={styles.cacheLabel}>📱 Offline Mode (Cached)</Text>}
    </View>
  );
};

export default function DashboardScreen() {
  const [weather, setWeather] = useState(null);
  const [crypto, setCrypto] = useState(null);
  
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  
  const [errorWeather, setErrorWeather] = useState(false);
  const [errorCrypto, setErrorCrypto] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // Parallel Fetch Function
  const fetchData = async () => {
    // Reset states for refresh
    setErrorWeather(false);
    setErrorCrypto(false);
    
    // We don't necessarily want to unset data while refreshing to avoid flicker,
    // but we can set loading/refreshing indicators.
    
    // We strictly follow the requirement of parallel loading (independent).
    
    const weatherPromise = api.get('https://api.open-meteo.com/v1/forecast?latitude=13.7563&longitude=100.5018&current_weather=true')
        .then(res => {
            setWeather(res.data);
            setLoadingWeather(false);
            if (res.fromCache) console.log("Weather loaded from cache");
        })
        .catch(err => {
            console.error("Weather failed", err);
            setErrorWeather(true);
            setLoadingWeather(false);
        });

    const cryptoPromise = api.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(res => {
            setCrypto(res.data);
            setLoadingCrypto(false);
            if (res.fromCache) console.log("Crypto loaded from cache");
        })
        .catch(err => {
            console.error("Crypto failed", err);
            setErrorCrypto(true);
            setLoadingCrypto(false);
        });

    // Wait for BOTH to finish (settled) before stop refreshing
    await Promise.allSettled([weatherPromise, cryptoPromise]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setLoadingWeather(true);
    setLoadingCrypto(true);
    fetchData();
  };

  return (
    <ScrollView 
        style={styles.container}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
    >
      <Text style={styles.header}>Dashboard</Text>
      
      <View style={styles.section}>
        <WeatherCard data={weather} loading={loadingWeather} error={errorWeather} />
      </View>

      <View style={styles.section}>
        <CryptoCard data={crypto} loading={loadingCrypto} error={errorCrypto} />
      </View>

      <Text style={styles.hint}>Pull down to refresh both APIs</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 120,
    justifyContent: 'center',
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  temp: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#888',
  },
  label: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
  },
  cacheLabel: {
    marginTop: 10,
    fontSize: 12,
    color: '#D97706',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  hint: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
  }
});
