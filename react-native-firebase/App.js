import React, { useState, useEffect } from 'react';
import { View, Button, Text, Animated, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Navegação
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Componentes individuais
const Login = ({ navigation, route }) => (
  <View>
    <Button onPress={() => route.params.funcLogar(true)} title="Logar" />
    <Button onPress={() => navigation.navigate('Registrar')} title="Registrar" />
  </View>
);

const Registrar = () => <Text>Registrar</Text>;
const Avisos = () => <Text>Avisos</Text>;
const Perfil = () => <Text>Perfil</Text>;
const Home = () => <Text>Home</Text>;
const Config = () => <Text>Config</Text>;
const Contatos = () => <Text>Contatos</Text>;

// Temporizador de Respiração
const Respiracao = () => {
  const [fase, setFase] = useState('Inale');
  const [contador, setContador] = useState(4);
  const animacao = useState(new Animated.Value(1))[0];

  const iniciarAnimacao = (fase) => {
    let duracao;
    let valor;

    if (fase === 'Inale') {
      valor = 1.5;
      duracao = 4000;
    } else if (fase === 'Exale') {
      valor = 1;
      duracao = 6000;
    }

    Animated.timing(animacao, {
      toValue: valor,
      duration: duracao,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  useEffect(() => {
    const cicloRespiracao = {
      Inale: { proximaFase: 'Segure', duracao: 4 },
      Segure: { proximaFase: 'Exale', duracao: 4 },
      Exale: { proximaFase: 'Inale', duracao: 6 },
    };

    const intervalo = setInterval(() => {
      setContador((prev) => {
        if (prev === 1) {
          setFase(cicloRespiracao[fase].proximaFase);
          return cicloRespiracao[fase].duracao;
        }
        return prev - 1;
      });
    }, 1000);

    iniciarAnimacao(fase);

    return () => clearInterval(intervalo); // Limpeza do intervalo
  }, [fase]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{fase} por {contador} segundos</Text>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#ADD8E6',
          transform: [{ scale: animacao }],
        }}
      />
    </View>
  );
};

// Função principal App
const App = () => {
  const [EstaLogado, setLogado] = useState(false);

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Respiracao" component={Respiracao} options={{ title: 'Exercício de Respiração' }} />
    </Stack.Navigator>
  );

  const HomeTab = () => (
    <Tab.Navigator>
      <Tab.Screen name="Home_tab" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Avisos" component={Avisos} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {EstaLogado ? (
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={HomeTab} />
          <Drawer.Screen name="Config" component={Config} />
          <Drawer.Screen name="Contatos" component={Contatos} />
          
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} initialParams={{ funcLogar: setLogado }} />
          <Stack.Screen name="Registrar" component={Registrar} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
