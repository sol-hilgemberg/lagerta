import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing 
} from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(-20)).current;

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    // Animación de aparición del título
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Limpieza del sonido al desmontar
    return () => {
      sound?.unloadAsync();
    };
  }, []);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/click.mp3') // Pon aquí el path correcto de tu sonido
    );
    setSound(sound);
    await sound.playAsync();
  }

  const handlePress = async (path: string) => {
    await playSound();
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowBackground,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.4],
            }),
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: moveAnim }],
            },
          ]}
        >
          🔮 Bienvenido al Juego del Tarot 🔮
        </Animated.Text>

        {[
          { label: '🪙 Suscripción', path: '/suscripcion' },
          { label: '🎬 Demo', path: '/demo' },
          { label: '📜 Tiradas y más ..', path: '/modo-historia' },
          { label: '⚔️ Juego y Aprendizaje', path: '/modo-duelo' },
          { label: '🃏 Juego Tarot API', path: '/modo-juego-api' },
          { label: '📜 Historial de Tiradas', path: '/historial' },
        ].map(({ label, path }) => (
          <TouchableOpacity
            key={path}
            style={styles.button}
            onPress={() => handlePress(path)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1523',
    justifyContent: 'center',
    position: 'relative',
  },
  glowBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFD700',
    borderRadius: 150,
    width: 300,
    height: 300,
    top: 50,
    left: '50%',
    marginLeft: -150,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 40,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 10,
    width: 280,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
});
