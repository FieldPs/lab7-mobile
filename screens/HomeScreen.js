import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from Open Library using Axios
  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://openlibrary.org/subjects/sci-fi.json?limit=20');
      setBooks(response.data.works);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load 'favorites' status from AsyncStorage whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favoriteBooks');
          if (storedFavorites !== null) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch (error) {
          console.error(error);
        }
      };
      
      if (books.length === 0) {
        fetchBooks();
      }
      loadFavorites();
    }, [books]) 
  );

  const renderItem = ({ item }) => {
    // Check if book ID is in favorites array
    const isFavorite = favorites.includes(item.key);

    return (
      <TouchableOpacity 
        style={styles.itemContainer} 
        onPress={() => navigation.navigate('Detail', { book: item })}
      >
        {item.cover_id ? (
          <Image 
            source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg` }} 
            style={styles.cover} 
          />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]} />
        )}
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title} 
          </Text>
          <Text style={styles.author}>
            {item.authors ? item.authors.map(a => a.name).join(', ') : 'Unknown Author'}
          </Text>
        </View>

        {isFavorite && (
          <View style={styles.iconContainer}>
            <Text style={styles.heartIcon}>❤️</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  placeholderCover: {
    backgroundColor: '#ddd',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  iconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 20,
    color: 'red',
  },
});
