import React, { useState } from 'react';

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

const Home: React.FC = () => {
  const [activePlan, setActivePlan] = useState('free');

  const handlePress = (planId: string) => {
    setActivePlan(planId);
    alert(
      planId === 'pro'
        ? '¡Bienvenido a Pro!\nHas seleccionado el plan PRO.'
        : 'Modo Gratis\nHas seleccionado el plan GRATIS.'
    );
    // Aquí pones tu lógica real para suscripción o activar plan
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Elige tu plan de Tarot</h1>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              ...styles.card,
              ...(plan.isPro ? styles.proCard : styles.freeCard),
              ...(activePlan === plan.id ? styles.activeCard : {}),
            }}
          >
            <h2 style={{ ...styles.title, ...(plan.isPro ? styles.proTitle : {}) }}>{plan.title}</h2>
            <div style={{ ...styles.price, ...(plan.isPro ? styles.proPrice : {}) }}>{plan.price}</div>
            <ul style={{ paddingLeft: 20 }}>
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  style={{ ...styles.feature, ...(plan.isPro ? styles.proFeature : {}) }}
                >
                  {feature}
                </li>
              ))}
            </ul>
            <button
              style={{
                ...styles.button,
                ...(plan.isPro ? styles.proButton : styles.freeButton),
                ...(plan.isPro ? styles.proButtonText : styles.freeButtonText),
              }}
              onClick={() => handlePress(plan.id)}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#1B1523',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    border: '1px solid #555',
    width: '100%',
  },
  freeCard: {
    background: '#2E2A3D',
  },
  proCard: {
    background: '#FFD700',
    border: 'none',
  },
  activeCard: {
    border: '2px solid #fff',
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
    fontWeight: 600,
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
    padding: '14px 0',
    borderRadius: 12,
    width: '100%',
    fontWeight: 'bold',
    fontSize: 18,
    border: 'none',
    cursor: 'pointer',
  },
  freeButton: {
    background: '#444',
  },
  proButton: {
    background: '#1B1523',
  },
  freeButtonText: {
    color: '#FFD700',
  },
  proButtonText: {
    color: '#FFD700',
  },
};

export default Home;