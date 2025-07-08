import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CardQuestion({ card, onNext }) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setShowAnswer(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{card.name}</Text>
      <Image source={card.image} style={styles.image} />
      {card.options.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            selected === option && {
              backgroundColor: option === card.correctMeaning ? 'green' : 'red'
            }
          ]}
          disabled={showAnswer}
          onPress={() => handleSelect(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {showAnswer && (
        <TouchableOpacity onPress={onNext} style={styles.nextButton}>
          <Text style={styles.nextText}>Siguiente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 200, height: 300, resizeMode: 'contain', marginVertical: 20 },
  option: {
    backgroundColor: '#ccc',
    padding: 12,
    marginVertical: 5,
    width: '100%',
    borderRadius: 8,
  },
  optionText: { textAlign: 'center', fontSize: 16 },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8
  },
  nextText: { color: 'white', fontWeight: 'bold' }
});
// Este componente muestra una carta del tarot con opciones de respuesta.
// Al seleccionar una opción, se muestra si es correcta o incorrecta y se habilita un botón para continuar a la siguiente carta.
// Puedes usar este componente en tu aplicación principal para mostrar las cartas y manejar la lógica del juego.
// Asegúrate de importar las imágenes correctamente y de que las rutas sean correctas.
// Puedes personalizar los estilos según tus necesidades.
// Asegúrate de que las imágenes de las cartas estén en la carpeta assets/images y que las rutas sean correctas.
