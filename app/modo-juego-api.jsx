import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function ModoJuegoAPI() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cambia esta URL por la de tu API real de cartas
  const API_URL = 'https://your-tarot-api.example.com/cards';

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar cartas');
        const data = await response.json();
        setCards(data.cards || []);  // Suponiendo que la respuesta trae { cards: [...] }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Cargando cartas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🃏 Cartas Dinámicas desde API</Text>
      {cards.map((card, index) => (
        <View key={index} style={styles.card}>
          {/* Asumiendo card tiene .name y .image (url) */}
          <Image source={{ uri: card.image }} style={styles.cardImage} resizeMode="contain" />
          <Text style={styles.cardName}>{card.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1B1523',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: 280,
    alignItems: 'center',
  },
  cardImage: {
    width: 180,
    height: 280,
    marginBottom: 10,
  },
  cardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    backgroundColor: '#1B1523',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFD700',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
