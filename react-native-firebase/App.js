import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, Animated, Easing, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import app from './firebaseConfig.js';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const image = {uri: 'https://lh6.googleusercontent.com/proxy/2u8JACI6bBeCaamYijrU8jyhZGADPr2Px0MCGuWdzkubPwhW4T7PO40anM6ciozTRaelmP_1jIn9i9Qme59kqnm2Dg0-M2eEmtv9D7DBBxl3tSRX6hZCywdQgkdN9ZJSoYMxcg1AiWXCqhYY0TOTCgInHUd3'};

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const users = [{ username: 'usuario', password: 'senha123' }];

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
    <ImageBackground source={image} style={styles.backgroundImage}>
    <View style={styles.container}>
    <Image
          source={require('./assets/calm1.png')}
          style={styles.logo}
        />
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Cuide de si hoje.</Text>
      
      <TextInput
        placeholder="E-mail"
        value={username}
        onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#A9A9A9"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
          <Text style={styles.registerText}>Registrar-se</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

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
    <ImageBackground source={image} style={styles.backgroundImage}>
    <View style={styles.container}>
    <Image
          source={require('./assets/couple.png')}
          style={styles.logo}
        />
      <Text style={styles.title}>Crie sua conta</Text>
      <Text style={styles.subtitle}>para continuar</Text>
      <TextInput
        placeholder="E-mail"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
    </ImageBackground>
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

    return () => clearInterval(intervalo); 
  }, [fase]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fase} por {contador} segundos</Text>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#ADD8E6',
          transform: [{ scale: animacao }],
        }}
      />
      <Text style={styles.subText}>Respire profundamente e acalme sua mente.</Text>
    </View>
  );
};

const Agendamento = () => (
  <View style={styles.container}>
    <Text>Agendamentos para consultas</Text>
  </View>
);

const SobreNos = () => (
  <View style={styles.container}>
    <Text></Text>
  </View>
);

const App = () => {
  const [EstaLogado, setLogado] = useState(false);

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Respiracao" component={Respiracao} options={{ title: 'Exercício de Respiração' }} />
      <Stack.Screen name="Agendamento" component={Agendamento} options={{ title: 'Agendamentos' }} />
      <Stack.Screen name="SobreNos" component={SobreNos} options={{ title: 'Sobre Nós' }} />
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

const Home = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Bem-vindo(a) ao EquilibraMente</Text>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Perfil')}
      >
        <Text style={styles.optionButtonText}>Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Respiracao')}
      >
        <Text style={styles.optionButtonText}>Exercício de Respiração</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => alert('Função de agendamento em breve!')}
      >
        <Text style={styles.optionButtonText}>Agendamento de Consultas</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('SobreNos')}
      >
        <Text style={styles.optionButtonText}>Sobre Nós</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fundo semi-transparente
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  welcomeText: {
    height: 50,
    fontSize: 20,
    marginBottom: 20,
    borderRadius: 30,
    fontWeight: 'bold',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    marginVertical: 5,
    width: '100%',
  },
  input: {
    height: 45,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 15,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 10,
  },
  registerText: {
    color: '#4A90E2',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 100, // Largura da imagem
    height: 100, // Altura da imagem
    marginBottom: 20, // Espaço entre a imagem e o título "Bem-vindo!"
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: 20,
    borderRadius: 10,
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
