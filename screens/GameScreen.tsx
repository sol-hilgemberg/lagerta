import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { tarotCards, tarotMeanings } from '@/data/tarotCards';

export default function GameScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const currentCard = tarotCards[currentIndex];
  const correctMeaning = tarotMeanings[currentCard.name];

  useEffect(() => {
    if (!correctMeaning) return;

    // Obtener significados incorrectos al azar
    const allMeanings = Object.values(tarotMeanings).filter(
      (m) => m && m !== correctMeaning
    );
    const distractors = shuffleArray(allMeanings).slice(0, 2);
    const newOptions = shuffleArray([correctMeaning, ...distractors]);

    setOptions(newOptions);
    setSelected(null);
  }, [currentIndex]);

  const handleOptionPress = (option: string) => {
    setSelected(option);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % tarotCards.length);
    }, 1500);
  };

  if (!currentCard) return <Text>No hay carta</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentCard.name}</Text>
      <Image source={currentCard.image} style={styles.image} />

      {options.map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selected &&
              (opt === correctMeaning
                ? styles.correct
                : opt === selected
                ? styles.incorrect
                : null),
          ]}
          onPress={() => handleOptionPress(opt)}
          disabled={!!selected}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Mezcla aleatoria
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 12,
  },
  image: {
    width: 220,
    height: 320,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 12,
  },
  option: {
    backgroundColor: '#333',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  correct: {
    backgroundColor: 'green',
  },
  incorrect: {
    backgroundColor: 'red',
  },
});
