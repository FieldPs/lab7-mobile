import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DetailScreen({ route, navigation }) {
  const { book } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if this specific book is already in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteBooks');
        if (storedFavorites !== null) {
          const favorites = JSON.parse(storedFavorites);
          if (favorites.includes(book.key)) {
            setIsFavorite(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkFavoriteStatus();
  }, [book.key]);

  // Fetch Description from API
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        // book.key looks like "/works/OL12345W"
        const response = await axios.get(`https://openlibrary.org${book.key}.json`);
        const data = response.data;
        if (data.description) {
           // Description can be a string or an object { type: 'text', value: '...' }
           const desc = typeof data.description === 'string' ? data.description : data.description.value;
           setDescription(desc);
        } else {
           setDescription('No description available.');
        }
      } catch (error) {
        console.error(error);
        setDescription('Failed to load description.');
      } finally {
        setLoading(false);
      }
    };
    fetchDescription();
  }, [book.key]);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteBooks');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (!favorites.includes(book.key)) {
        favorites.push(book.key);
        setIsFavorite(true);
        Alert.alert("Success", "Added to Favorites!");
      } else {
        favorites = favorites.filter(id => id !== book.key);
        setIsFavorite(false);
        Alert.alert("Removed", "Removed from Favorites.");
      }
      await AsyncStorage.setItem('favoriteBooks', JSON.stringify(favorites));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save status.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {book.cover_id ? (
          <Image 
            source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` }} 
            style={styles.cover} 
          />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>
          by {book.authors ? book.authors.map(a => a.name).join(', ') : 'Unknown Author'}
        </Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.label}>Description:</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#4F46E5" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.text}>{description}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.label}>First Published:</Text>
        <Text style={styles.text}>{book.first_publish_year || 'Unknown'}</Text>

        <TouchableOpacity 
          style={[styles.button, isFavorite && styles.favoriteButton]} 
          onPress={toggleFavorite}
        >
          <Text style={styles.buttonText}>
            {isFavorite ? "Favorite ❤️" : "Add to Favorites ♡"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
  },
  cover: {
    width: 150,
    height: 230,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  placeholderCover: {
    backgroundColor: '#ccc',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  favoriteButton: {
    backgroundColor: '#E11D48', // Red for Favorite
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
