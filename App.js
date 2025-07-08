import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ModoHistoriaScreen from './screens/ModoHistoriaScreen';
import DemoScreen from './screens/DemoScreen';
import SuscripcionScreen from './screens/SuscripcionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Aprende Tarot' }} />
        <Stack.Screen name="ModoHistoria" component={ModoHistoriaScreen} options={{ title: 'Tiradas' }} />
        <Stack.Screen name="Demo" component={DemoScreen} options={{ title: 'Demo' }} />
        <Stack.Screen name="Suscripcion" component={SuscripcionScreen} options={{ title: 'Suscripción' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
