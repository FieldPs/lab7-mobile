import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native';

export default function ProfileScreen() {
  const [profileBorderColor, setProfileBorderColor] = useState('#4F46E5'); // Initial color (Indigo)

  const getRandomColor = () => {
    const hex = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hex[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const socialLinks = [
    { name: 'Facebook', color: '#1877F2' },
    { name: 'GitHub', color: '#181717' },
    { name: 'Portfolio', color: '#E4405F' },
  ];

  const handlePress = (name) => {
    Alert.alert('Link Pressed', `You pressed ${name}`);
    setProfileBorderColor(getRandomColor());
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.imageContainer, { borderColor: profileBorderColor }]}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReiZVQ7qfsxP8skkRZKsjH-MxUkIRKHMIepg&s' }}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.name}>Garfield</Text>
        <Text style={styles.bio}>React Native Developer</Text>

        <View style={styles.buttonContainer}>
          {socialLinks.map((link) => (
            <Pressable
              key={link.name}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: link.color, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
              ]}
              onPress={() => handlePress(link.name)}
            >
              <Text style={styles.buttonText}>{link.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    width: '85%',
    maxWidth: 350,
  },
  imageContainer: {
    borderWidth: 4,
    borderRadius: 75,
    padding: 3,
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
