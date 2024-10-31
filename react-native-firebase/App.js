import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, Animated, Easin, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import app from './firebaseConfig.js';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Navegação
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Dados de usuário simulados (em um app real, estariam em um banco de dados)
const users = [{ username: 'usuario', password: 'senha123' }];

// Tela de Login
const Login = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      route.params.funcLogar(true);
    } catch (err) {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Entrar" onPress={handleLogin} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Registrar-se" onPress={() => navigation.navigate('Registrar')} />
    </View>
  );
};

// Tela de Registro
const Registrar = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, username, password);
      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao registrar: ' + err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Registrar" onPress={handleRegister} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
};

const Perfil = () => (
  <View style={styles.container}>
    <Text>Gerencie seu perfil e informações aqui.</Text>
  </View>
);

const TabAvisos = () => (
  <View style={styles.container}>
    <Text>Avisos e lembretes aparecerão aqui!</Text>
  </View>
);

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
      <Tab.Screen name="Avisos" component={TabAvisos} />
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

// Componentes Home, Config e Contatos
const Home = () => <Text>Home</Text>;
const Config = () => <Text>Config</Text>;
const Contatos = () => <Text>Contatos</Text>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

export default App;
