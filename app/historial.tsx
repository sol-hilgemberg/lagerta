import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function HistorialScreen() {
  const [tiradas, setTiradas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [filtroCarta, setFiltroCarta] = useState('');
  const [filtroRuna, setFiltroRuna] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');

  // Modal y tirada seleccionada
  const modalizeRef = useRef<Modalize>(null);
  const [tiradaSeleccionada, setTiradaSeleccionada] = useState(null);

  useEffect(() => {
    cargarTiradas();
  }, []);

  async function cargarTiradas() {
    setCargando(true);
    const { data, error } = await supabase
      .from('tiradas')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error al cargar tiradas:', error);
      Alert.alert('Error', 'No se pudieron cargar las tiradas');
    } else {
      setTiradas(data);
    }
    setCargando(false);
  }

  // Abrir modal con tirada
  function abrirModal(tirada) {
    setTiradaSeleccionada(tirada);
    modalizeRef.current?.open();
  }

  // Cerrar modal
  function cerrarModal() {
    modalizeRef.current?.close();
  }

  // Borrar tirada con confirmación
  function confirmarBorrarTirada(id) {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro que quieres eliminar esta tirada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => borrarTirada(id),
        },
      ]
    );
  }

  async function borrarTirada(id) {
    const { error } = await supabase.from('tiradas').delete().eq('id', id);
    if (error) {
      Alert.alert('Error', 'No se pudo eliminar la tirada');
    } else {
      Alert.alert('Éxito', 'Tirada eliminada');
      // Actualizar lista y cerrar modal
      setTiradaSeleccionada(null);
      modalizeRef.current?.close();
      cargarTiradas();
    }
  }

  // Compartir interpretación
  async function compartirInterpretacion() {
    if (!tiradaSeleccionada) return;
    try {
      await Share.share({
        message: `Tirada del ${new Date(tiradaSeleccionada.creado_en).toLocaleString()}\n\nCartas: ${tiradaSeleccionada.cartas?.join(', ')}\nRunas: ${tiradaSeleccionada.runas?.join(', ')}\n\nInterpretación:\n${tiradaSeleccionada.interpretacion}`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la interpretación');
    }
  }

  // Filtrar tiradas con memo para optimizar
  const tiradasFiltradas = useMemo(() => {
    return tiradas.filter((t) => {
      // Filtrar carta
      if (filtroCarta && !t.cartas?.some((c) => c.toLowerCase().includes(filtroCarta.toLowerCase()))) {
        return false;
      }
      // Filtrar runa
      if (filtroRuna && !t.runas?.some((r) => r.toLowerCase().includes(filtroRuna.toLowerCase()))) {
        return false;
      }
      // Filtrar fecha desde
      if (filtroFechaDesde && new Date(t.creado_en) < new Date(filtroFechaDesde)) {
        return false;
      }
      // Filtrar fecha hasta
      if (filtroFechaHasta && new Date(t.creado_en) > new Date(filtroFechaHasta)) {
        return false;
      }
      return true;
    });
  }, [tiradas, filtroCarta, filtroRuna, filtroFechaDesde, filtroFechaHasta]);

  if (cargando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Cargando tiradas...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>📚 Historial de Tiradas</Text>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosContainer}
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 8 }}
        >
          <TextInput
            style={styles.inputFiltro}
            placeholder="Filtrar por carta"
            placeholderTextColor="#999"
            value={filtroCarta}
            onChangeText={setFiltroCarta}
          />
          <TextInput
            style={styles.inputFiltro}
            placeholder="Filtrar por runa"
            placeholderTextColor="#999"
            value={filtroRuna}
            onChangeText={setFiltroRuna}
          />
          <TextInput
            style={styles.inputFiltro}
            placeholder="Fecha desde (YYYY-MM-DD)"
            placeholderTextColor="#999"
            value={filtroFechaDesde}
            onChangeText={setFiltroFechaDesde}
          />
          <TextInput
            style={styles.inputFiltro}
            placeholder="Fecha hasta (YYYY-MM-DD)"
            placeholderTextColor="#999"
            value={filtroFechaHasta}
            onChangeText={setFiltroFechaHasta}
          />
        </ScrollView>

        {tiradasFiltradas.length === 0 ? (
          <Text style={styles.noTiradas}>No se encontraron tiradas con esos filtros.</Text>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {tiradasFiltradas.map((tirada, i) => (
              <View key={tirada.id || i} style={styles.card}>
                <Text style={styles.label}>🃏 Cartas:</Text>
                <Text style={styles.value}>{tirada.cartas?.join(', ')}</Text>

                <Text style={styles.label}>ᚠ Runas:</Text>
                <Text style={styles.value}>{tirada.runas?.join(', ')}</Text>

                <Text style={styles.label}>🔮 Interpretación:</Text>
                <Text style={styles.value} numberOfLines={3}>
                  {tirada.interpretacion}
                </Text>

                <Text style={styles.date}>
                  {new Date(tirada.creado_en).toLocaleString()}
                </Text>

                <View style={styles.botonesRow}>
                  <TouchableOpacity onPress={() => abrirModal(tirada)} style={styles.btnDetalle}>
                    <Ionicons name="eye-outline" size={20} color="#FFD700" />
                    <Text style={styles.btnText}>Ver detalle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => confirmarBorrarTirada(tirada.id)} style={styles.btnBorrar}>
                    <Ionicons name="trash-outline" size={20} color="#FF4444" />
                    <Text style={styles.btnText}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Modal Bottom Sheet */}
        <Modalize
          ref={modalizeRef}
          modalHeight={450}
          onClosed={() => setTiradaSeleccionada(null)}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          handleStyle={{ backgroundColor: '#FFD700' }}
        >
          {tiradaSeleccionada && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalle de Tirada</Text>

              <Text style={styles.label}>🃏 Cartas:</Text>
              <Text style={styles.value}>{tiradaSeleccionada.cartas?.join(', ')}</Text>

              <Text style={styles.label}>ᚠ Runas:</Text>
              <Text style={styles.value}>{tiradaSeleccionada.runas?.join(', ')}</Text>

              <Text style={styles.label}>🔮 Interpretación completa:</Text>
              <ScrollView style={{ maxHeight: 120, marginBottom: 10 }}>
                <Text style={[styles.value, { flexWrap: 'wrap' }]}>
                  {tiradaSeleccionada.interpretacion}
                </Text>
              </ScrollView>

              <Text style={styles.date}>
                {new Date(tiradaSeleccionada.creado_en).toLocaleString()}
              </Text>

              <View style={styles.botonesRowModal}>
                <TouchableOpacity
                  onPress={compartirInterpretacion}
                  style={[styles.btnDetalle, { flex: 1, marginRight: 10 }]}
                >
                  <Ionicons name="share-social-outline" size={22} color="#FFD700" />
                  <Text style={styles.btnText}>Compartir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => confirmarBorrarTirada(tiradaSeleccionada.id)}
                  style={[styles.btnBorrar, { flex: 1 }]}
                >
                  <Ionicons name="trash-outline" size={22} color="#FF4444" />
                  <Text style={styles.btnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={cerrarModal}
                style={{ marginTop: 15, alignSelf: 'center' }}
              >
                <Ionicons name="close-circle-outline" size={30} color="#FFD700" />
              </TouchableOpacity>
            </View>
          )}
        </Modalize>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B1523',
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    backgroundColor: '#1B1523',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  filtrosContainer: {
    marginBottom: 10,
  },
  inputFiltro: {
    backgroundColor: '#2E2636',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 6,
    minWidth: 120,
  },
  noTiradas: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#2E2636',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
  botonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBorrar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFD700',
    marginLeft: 6,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#1B1523',
    height: '100%',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  botonesRowModal: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
