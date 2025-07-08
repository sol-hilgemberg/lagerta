import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { tarotCards } from '@/data/tarotCards';
import { runes } from '@/data/runes';
import { supabase } from '@/lib/supabase';

const OPENROUTER_API_KEY = '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';

function obtenerCartasAleatorias(cantidad = 3) {
  const cartas = [...tarotCards];
  const seleccionadas = [];
  for (let i = 0; i < cantidad; i++) {
    const index = Math.floor(Math.random() * cartas.length);
    seleccionadas.push(cartas.splice(index, 1)[0]);
  }
  return seleccionadas;
}

function obtenerRunasAleatorias(cantidad = 2) {
  const disponibles = [...runes];
  const seleccionadas = [];
  for (let i = 0; i < cantidad; i++) {
    const index = Math.floor(Math.random() * disponibles.length);
    seleccionadas.push(disponibles.splice(index, 1)[0]);
  }
  return seleccionadas;
}

export default function ModoHistoriaScreen() {
  const [cartasTiradas, setCartasTiradas] = useState([]);
  const [runasTiradas, setRunasTiradas] = useState([]);
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cartasTiradas.length > 0 || runasTiradas.length > 0) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [cartasTiradas, runasTiradas]);

  const interpretarTirada = async () => {
    setCargando(true);
    setGuardado(false);

    const nuevasCartas = obtenerCartasAleatorias();
    const nuevasRunas = obtenerRunasAleatorias();

    setCartasTiradas(nuevasCartas);
    setRunasTiradas(nuevasRunas);

    const nombresCartas = nuevasCartas.map(c => c.name).join(', ');
    const nombresRunas = nuevasRunas.map(r => r.name).join(', ');

    const prompt = `He tirado estas cartas del tarot: ${nombresCartas}.
También han salido estas runas nórdicas: ${nombresRunas}.
Dame una interpretación mística, profunda y espiritual que integre ambos sistemas para el usuario.`;

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
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'TarotApp',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const textoIA =
        data?.choices?.[0]?.message?.content ||
        '❌ No se pudo obtener una respuesta de la IA.';

      setResultado(textoIA);
    } catch (error) {
      console.error('Error con OpenRouter:', error);
      setResultado('❌ Error al generar interpretación.');
    }

    setCargando(false);
  };

  const guardarTirada = async () => {
    const cartas = cartasTiradas.map(c => c.name);
    const runas = runasTiradas.map(r => r.name);

    const { error } = await supabase.from('tiradas').insert([
      {
        cartas,
        runas,
        interpretacion: resultado,
      },
    ]);

    if (error) {
      console.error('❌ Error al guardar tirada:', error);
      alert('Hubo un problema al guardar.');
    } else {
      console.log('✅ Tirada guardada en Supabase');
      setGuardado(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Modo Historia</Text>

      {(cartasTiradas.length > 0 || runasTiradas.length > 0) && (
        <Animated.View style={[styles.cartasContainer, { opacity: fadeAnim }]}>
          {cartasTiradas.map((carta, index) => (
            <View key={`carta-${index}`} style={styles.carta}>
              <Image source={carta.image} style={styles.imagen} />
              <Text style={styles.nombreCarta}>{carta.name}</Text>
            </View>
          ))}
          {runasTiradas.map((runa, index) => (
            <View key={`runa-${index}`} style={styles.carta}>
              <Image source={runa.image} style={styles.imagen} />
              <Text style={styles.nombreCarta}>{runa.name}</Text>
            </View>
          ))}
        </Animated.View>
      )}

      <TouchableOpacity style={styles.button} onPress={interpretarTirada}>
        <Text style={styles.buttonText}>🔮 Consultar IA</Text>
      </TouchableOpacity>

      {resultado !== '' && !cargando && (
        <TouchableOpacity style={styles.saveBtn} onPress={guardarTirada}>
          <Text style={styles.saveText}>
            {guardado ? '✅ Tirada guardada' : '💾 Guardar tirada'}
          </Text>
        </TouchableOpacity>
      )}

      {cargando ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.resultadoBox}>
          <Text style={styles.resultado}>{resultado}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1523',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  carta: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  imagen: {
    width: 80,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 5,
  },
  nombreCarta: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  saveText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultadoBox: {
    marginTop: 10,
    maxHeight: '40%',
    width: '100%',
  },
  resultado: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
  },
});
