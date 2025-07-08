import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';

export default function TarotGameAPI() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Cargar cartas desde API
  useEffect(() => {
    fetch('https://rws-cards-api.herokuapp.com/api/v1/cards/')
      .then((res) => res.json())
      .then((data) => {
        setCards(data.cards);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tarot cards:', err);
        Alert.alert('Error', 'No se pudieron cargar las cartas.');
        setLoading(false);
      });
  }, []);

  // Animación fade cuando cambia la carta
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [index]);

  // Preparar opciones para el quiz (1 correcta + 3 aleatorias)
  useEffect(() => {
    if (cards.length === 0) return;

    const correctMeaning = cards[index].meaning_up;
    // Filtramos las significados que no sean el correcto
    const otherMeanings = cards
      .filter((_, i) => i !== index)
      .map((c) => c.meaning_up)
      .filter((m) => m && m.length > 5); // evitar strings vacíos o muy cortos

    // Elegimos 3 opciones aleatorias
    let shuffled = otherMeanings.sort(() => 0.5 - Math.random());
    let chosenOptions = shuffled.slice(0, 3);

    // Insertamos la correcta y mezclamos
    chosenOptions.push(correctMeaning);
    chosenOptions = chosenOptions.sort(() => 0.5 - Math.random());

    setOptions(chosenOptions);
    setSelected(null);
    setFeedback('');
  }, [cards, index]);

  const handleOptionPress = (option) => {
    setSelected(option);
    if (option === cards[index].meaning_up) {
      setFeedback('✔️ ¡Correcto!');
    } else {
      setFeedback('❌ Incorrecto');
    }
  };

  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
    } else {
      Alert.alert('¡Felicidades!', 'Terminaste el juego.');
      setIndex(0);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  const card = cards[index];
  const imageUrl = `https://rws-cards-api.herokuapp.com/api/v1/images/${card.name.toLowerCase().replace(/\s/g, '-')}.jpg`;

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>{card.name}</Text>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.question}>¿Cuál es su significado?</Text>

        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              selected &&
                (opt === card.meaning_up
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

        {!!feedback && (
          <>
            <Text style={styles.feedback}>{feedback}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Siguiente carta</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.progress}>
          {index + 1} / {cards.length}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1523',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  question: {
    color: '#EEE',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#2E2636',
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    width: 320,
  },
  correct: {
    backgroundColor: '#4CAF50',
  },
  incorrect: {
    backgroundColor: '#F44336',
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
  },
  feedback: {
    fontSize: 22,
    marginTop: 20,
    color: '#fff',
  },
  nextBtn: {
    marginTop: 15,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 10,
  },
  nextText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progress: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
  },
});
