import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const api = axios.create({
  timeout: 10000, // 10s timeout
});

// Response Interceptor
api.interceptors.response.use(
  async (response) => {
    // On success: Cache the data
    try {
        console.log(`[API] Caching response for: ${response.config.url}`);
        await AsyncStorage.setItem(response.config.url, JSON.stringify(response.data));
    } catch (e) {
        console.error("Failed to cache response", e);
    }
    return response;
  },
  async (error) => {
    // On error (network or 500): Try to load from cache
    console.warn("[API] Request failed, checking cache...", error.message);
    
    if (error.config && error.config.url) {
        try {
            const cachedData = await AsyncStorage.getItem(error.config.url);
            if (cachedData) {
                console.log("[API] Returning cached data");
                return {
                    data: JSON.parse(cachedData),
                    status: 200,
                    headers: {},
                    config: error.config,
                    fromCache: true // Custom flag to indicate cache usage
                };
            }
        } catch (e) {
            console.error("Failed to recover from cache", e);
        }
    }
    
    return Promise.reject(error);
  }
);

export default api;
