import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { tarotCards, tarotMeanings } from '@/data/tarotCards';

const OPENROUTER_API_KEY = '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';

const isPremium = false; // Cambia a true para simular usuario premium

function obtenerCartasAleatorias(cantidad = 3, excluidas = []) {
  const disponibles = tarotCards.filter(c => !excluidas.includes(c.name));
  const seleccionadas = [];
  for (let i = 0; i < cantidad && disponibles.length; i++) {
    const index = Math.floor(Math.random() * disponibles.length);
    seleccionadas.push(disponibles.splice(index, 1)[0]);
  }
  return seleccionadas;
}

export default function ModoDueloScreen() {
  const [rondas, setRondas] = useState([
    { cartas: obtenerCartasAleatorias(3), interpretacion: '', feedback: '' },
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [finalizado, setFinalizado] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [esperandoAnuncio, setEsperandoAnuncio] = useState(false);

  const rondaActual = rondas[rondas.length - 1];

  const simularVerAnuncio = () => {
    return new Promise((resolve) => {
      Alert.alert(
        '¿Quieres evitar anuncios?',
        'Hazte usuario Premium para avanzar sin interrupciones.',
        [
          { text: 'Más tarde', style: 'cancel', onPress: resolve },
          {
            text: 'Hazme Premium',
            onPress: () => {
              Alert.alert('✨ Premium', 'Esta opción estará disponible pronto.');
              resolve();
            },
          },
        ],
        { cancelable: false }
      );

      setEsperandoAnuncio(true);
      setTimeout(() => {
        setEsperandoAnuncio(false);
        resolve();
      }, 2000);
    });
  };

  const enviarInterpretacion = async () => {
    if (!input.trim()) return;
    setCargando(true);

    const significados = rondaActual.cartas
      .map(c => `${c.name}: ${tarotMeanings[c.name] || 'Sin significado disponible.'}`)
      .join('\n');

    const prompt = `
Eres un maestro del tarot. Aquí las cartas y sus significados:
${significados}

Un usuario hizo esta interpretación:
"${input}"

Evalúa si es correcta, profunda y coherente. Responde con "APROBADO" o "RECHAZADO" y una explicación breve. Indica si puede avanzar o no a la siguiente ronda.
`;

    const body = {
      model: 'meta-llama/llama-3-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const feedbackIA = data?.choices?.[0]?.message?.content || 'No se pudo generar feedback.';
      const actualizada = { ...rondaActual, interpretacion: input, feedback: feedbackIA };
      const nuevasRondas = [...rondas.slice(0, -1), actualizada];
      setRondas(nuevasRondas);
      setInput('');

      const puedeAvanzar = /aprobado|puede avanzar|correcto|bien hecho|excelente|muy bien/i.test(
        feedbackIA
      );

      if (puedeAvanzar) {
        if (nuevasRondas.length === 3) {
          await generarCierreGlobal(nuevasRondas);
          setCargando(false);
          return;
        }

        if (!isPremium && (nuevasRondas.length === 1 || nuevasRondas.length === 2)) {
          await simularVerAnuncio();
        }

        const usadas = nuevasRondas.flatMap(r => r.cartas.map(c => c.name));
        const nuevasCartas = obtenerCartasAleatorias(3, usadas);
        setRondas([...nuevasRondas, { cartas: nuevasCartas, interpretacion: '', feedback: '' }]);
        setIntentosRestantes(3);
      } else {
        if (intentosRestantes > 1) {
          setIntentosRestantes(intentosRestantes - 1);
        } else {
          Alert.alert('Intentos agotados', 'Debes ver un anuncio para seguir intentando.');
          await simularVerAnuncio();
          setIntentosRestantes(3);
        }
      }
    } catch (err) {
      console.error('Error IA:', err);
      Alert.alert('Error', 'No se pudo conectar con la IA.');
    }

    setCargando(false);
  };

  const generarCierreGlobal = async (rondasFinales) => {
    setCargando(true);
    const cartasTotales = rondasFinales.flatMap(r => r.cartas.map(c => c.name));
    const texto = `Estas son las 9 cartas: ${cartasTotales.join(', ')}. Haz una interpretación final mística que combine todos los significados en una lectura profunda.`;

    const body = {
      model: 'meta-llama/llama-3-8b-instruct',
      messages: [{ role: 'user', content: texto }],
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const final = data?.choices?.[0]?.message?.content || 'Interpretación no generada.';
      setFinalizado(final);
    } catch (err) {
      console.error('Error en cierre:', err);
      setFinalizado('❌ Error al generar interpretación final.');
    }

    setCargando(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🧠 Juego y Aprendizaje</Text>

        {rondas.map((ronda, idx) => (
          <View key={idx} style={styles.rondaBox}>
            <Text style={styles.rondaTitle}>Ronda {idx + 1}</Text>
            <View style={styles.cartasContainer}>
              {ronda.cartas.map((carta, i) => (
                <View key={i} style={styles.carta}>
                  <Image source={carta.image} style={styles.imagen} />
                  <Text style={styles.nombreCarta}>{carta.name}</Text>
                </View>
              ))}
            </View>

            {ronda.feedback ? (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackText}>{ronda.feedback}</Text>
              </View>
            ) : idx === rondas.length - 1 && !finalizado && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe tu interpretación..."
                  placeholderTextColor="#aaa"
                  multiline
                  value={input}
                  onChangeText={setInput}
                  editable={!cargando && !esperandoAnuncio}
                />
                <TouchableOpacity
                  style={[styles.button, (cargando || esperandoAnuncio) && { opacity: 0.6 }]}
                  onPress={enviarInterpretacion}
                  disabled={cargando || esperandoAnuncio}
                >
                  <Text style={styles.buttonText}>📤 Enviar interpretación</Text>
                </TouchableOpacity>
                <Text style={styles.intentos}>Intentos restantes: {intentosRestantes}</Text>
              </>
            )}
          </View>
        ))}

        {cargando && <ActivityIndicator size="large" color="#FFD700" style={{ marginVertical: 20 }} />}

        {finalizado !== '' && (
          <View style={styles.finalBox}>
            <Text style={styles.finalTitle}>🔚 Interpretación Final</Text>
            <Text style={styles.finalText}>{finalizado}</Text>
          </View>
        )}
      </ScrollView>

      {/* 🎥 Modal visual para "ver anuncio" */}
      <Modal visible={esperandoAnuncio} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>🎥 Viendo publicidad simulada...</Text>
            <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 20 }} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B1523',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  rondaBox: { marginBottom: 30 },
  rondaTitle: { color: '#FFD700', fontSize: 20, marginBottom: 10 },
  cartasContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  carta: { alignItems: 'center' },
  imagen: {
    width: 80,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 5,
  },
  nombreCarta: { color: '#FFD700', fontSize: 12 },
  input: {
    backgroundColor: '#2E2636',
    color: 'white',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  feedbackBox: {
    backgroundColor: '#2E2636',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  feedbackText: { color: 'white' },
  finalBox: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  finalTitle: { color: '#FFD700', fontSize: 18, marginBottom: 10 },
  finalText: { color: 'white' },
  intentos: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#2E2636',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
    fontSize: 18,
  },
});
