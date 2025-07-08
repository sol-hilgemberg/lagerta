import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, StyleSheet } from 'react-native';

const plans = [
  {
    id: 'free',
    title: 'Gratis',
    price: '$0',
    features: [
      'Tiradas básicas',
      'Acceso limitado a cartas',
      'Publicidad ocasional',
    ],
    buttonText: 'Seguir Gratis',
    isPro: false,
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '$4.99/mes',
    features: [
      'Tiradas ilimitadas',
      'Todas las cartas desbloqueadas',
      'Sin publicidad',
      'Contenido exclusivo',
    ],
    buttonText: 'Suscribirme',
    isPro: true,
  },
];

export default function SubscriptionPlans() {
  const [activePlan, setActivePlan] = useState('free');

  const handlePress = (planId: string) => {
    setActivePlan(planId);
    if (Platform.OS === 'web') {
      alert(
        planId === 'pro'
          ? '¡Bienvenido a Pro!\nHas seleccionado el plan PRO.'
          : 'Modo Gratis\nHas seleccionado el plan GRATIS.'
      );
    } else {
      Alert.alert(
        planId === 'pro' ? '¡Bienvenido a Pro!' : 'Modo Gratis',
        `Has seleccionado el plan ${planId.toUpperCase()}.`
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Elige tu plan de Tarot</Text>
      {plans.map(plan => (
        <View
          key={plan.id}
          style={[
            styles.card,
            plan.isPro ? styles.proCard : styles.freeCard,
            activePlan === plan.id && styles.activeCard,
          ]}
        >
          <Text style={[styles.title, plan.isPro && styles.proTitle]}>{plan.title}</Text>
          <Text style={[styles.price, plan.isPro && styles.proPrice]}>{plan.price}</Text>
          {plan.features.map((feature, idx) => (
            <Text
              key={idx}
              style={[styles.feature, plan.isPro && styles.proFeature]}
            >
              • {feature}
            </Text>
          ))}

          <TouchableOpacity
            style={[styles.button, plan.isPro ? styles.proButton : styles.freeButton]}
            onPress={() => handlePress(plan.id)}
          >
            <Text style={[styles.buttonText, plan.isPro ? styles.proButtonText : styles.freeButtonText]}>
              {plan.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#1B1523',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  freeCard: {
    backgroundColor: '#2E2A3D',
    borderWidth: 1,
    borderColor: '#555',
  },
  proCard: {
    backgroundColor: '#FFD700',
    borderWidth: 0,
  },
  activeCard: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ccc',
  },
  proTitle: {
    color: '#1B1523',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#ccc',
  },
  proPrice: {
    color: '#1B1523',
  },
  feature: {
    fontSize: 16,
    marginBottom: 6,
    color: '#ccc',
  },
  proFeature: {
    color: '#1B1523',
  },
  button: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  freeButton: {
    backgroundColor: '#444',
  },
  proButton: {
    backgroundColor: '#1B1523',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  freeButtonText: {
    color: '#FFD700',
  },
  proButtonText: {
    color: '#FFD700',
  },
});