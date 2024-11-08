import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, Animated, Easing, StyleSheet, ImageBackground, TouchableOpacity, Image, FlatList, Vibration, ScrollView, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import app from './firebaseConfig.js';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

const image = {uri: 'https://lh6.googleusercontent.com/proxy/2u8JACI6bBeCaamYijrU8jyhZGADPr2Px0MCGuWdzkubPwhW4T7PO40anM6ciozTRaelmP_1jIn9i9Qme59kqnm2Dg0-M2eEmtv9D7DBBxl3tSRX6hZCywdQgkdN9ZJSoYMxcg1AiWXCqhYY0TOTCgInHUd3'};
const image2 = {uri: 'https://img.freepik.com/premium-photo/vertical-photo-young-asian-woman-relaxed-meditating-sitting-outdoors-with-hands-together-eyes-closed-concept-spirituality-relax_362480-929.jpg'};
const image3 = {uri: 'https://i.imgur.com/DoVi2eu.jpeg'};
const image4 = {uri: 'https://i.imgur.com/QZBG7GZ.png'};

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

const FuncDicas = () => {
  const renderItem = ({ item }) => {
    if (item.tipo === 'texto') {
      return (
        <View style={styles.dicaContainer}>
          <Text style={styles.dicaTexto}>{item.conteudo}</Text>
        </View>
      );
    } else if (item.tipo === 'video') {
      return (
        <View style={styles.videoContainer}>
          <WebView source={{ uri: item.conteudo }} style={{ height: 200, width: '100%' }} />
        </View>
      );
    }
  };

  return (
    <ImageBackground source={image2} style={styles.backgroundImage}>
    <View style={styles.container}>
      <FlatList
        data={dicas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
    </ImageBackground>
  );
};

const dicas = [
  {
    id: '1',
    tipo: 'texto',
    conteudo: '🫁 Pratique a respiração profunda: inspire contando até quatro, segure e expire contando até seis. Ultilize o nosso exercício de respiração para te ajudar.',
  },
  {
    id: '2',
    tipo: 'texto',
    conteudo: '🍃 Experimente um vídeo de respiração guiada, ótimas para quem procura uma calmaria em momentos de crise.',
  },
  {
    id: '3',
    tipo: 'texto',
    conteudo: '🧘🏻‍♀️ Experimente a técnica de mindfulness: observe seus pensamentos sem julgá-los e concentre-se no momento presente.',
  },
  {
    id: '4',
    tipo: 'texto',
    conteudo: '🤸🏻 Pratique alongamentos leves. Movimentar o corpo ajuda a liberar a tensão acumulada e relaxar a mente.',
  },
  {
    id: '5',
    tipo: 'texto',
    conteudo: '🎵 Escute uma música calma e relaxante, preferencialmente sem letras, para ajudar a desacelerar os pensamentos.',
},
];

const FuncRespiracao = () => {
  const [fase, setFase] = useState('Inspire');
  const [contador, setContador] = useState(4);
  const [respiracaoAtiva, setRespiracaoAtiva] = useState(false);
  const animacao = useState(new Animated.Value(1))[0];

  const gifUrl = 'https://i.pinimg.com/originals/0c/3e/75/0c3e7535280bb0da6a39df25fd382a54.gif';

  const iniciarAnimacao = (fase) => {
    let duracao;
    let valor;

    if (fase === 'Inspire') {
      valor = 1.5;
      duracao = 4000;
    } else if (fase === 'Expire') {
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
    if (!respiracaoAtiva) return;

    const cicloRespiracao = {
      Inspire: { proximaFase: 'Expire', duracao: 6 },
      Expire: { proximaFase: 'Inspire', duracao: 6 },
    };

    const intervalo = setInterval(() => {
      setContador((prev) => {
        if (prev === 1) {       
          Vibration.vibrate([500, 1000, 1500]);
          setFase(cicloRespiracao[fase].proximaFase);
          return cicloRespiracao[fase].duracao;
        }
        const vibracaoTempo = Array(prev).fill(100);
        Vibration.vibrate(vibracaoTempo);
        return prev - 1;
      });
    }, 1000);

    iniciarAnimacao(fase);

    return () => clearInterval(intervalo); 
  }, [fase, respiracaoAtiva]);

  const iniciarRespiracao = () => {
    setRespiracaoAtiva(true);
    setFase('Inspire');
    setContador(4);
  };

  return (
    <ImageBackground source={image2} style={styles.backgroundImage}>
    <View style={styles.container}>
      {!respiracaoAtiva ? (
          <>
          <Text style={styles.instructions}>
            Encontre um lugar tranquilo e confortável. Sente-se com a coluna ereta e feche os olhos.
            Quando estiver pronto, pressione o botão para iniciar o exercício de respiração.
            Lembre-se de acompanhar o ritmo da respiração guiada e concentre-se apenas em seu ritmo respiratório.
          </Text>
          <Button title="Iniciar exercício" onPress={iniciarRespiracao} />
        </>
      ) : (
        <>
          <Image source={{ uri: gifUrl }} style={styles.gif} />
          <Text style={styles.title}>{fase} por {contador} segundos</Text>
          <Text style={styles.subText}>Respire profundamente e acalme sua mente.</Text>
        </>
      )}
    </View>
    </ImageBackground>
  );
};

const FuncAgendamento = () => {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horario, setHorario] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('');
  const horarios = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleAgendar = () => {
    const telefone = "5521964850884";
    const mensagem = `Olá, gostaria de agendar uma consulta particular: *${tipoConsulta}* para o dia 📅 *${dataSelecionada}* às 🕔 *${horario}hrs*. Vim pelo app 🩷`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.containerAgen}>
      <Text style={styles.titleAgen}>Selecione a data:</Text>

      <Calendar
        onDayPress={(day) => setDataSelecionada(day.dateString)}
        markedDates={{
          [dataSelecionada]: { selected: true, selectedColor: '#ADD8E6' },
        }}
      />

      <Text style={styles.subtitleAgen}>Selecione o Horário:</Text>
      <View style={styles.horariosContainer}>
        {horarios.map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.horario, horario === h && styles.horarioSelecionado]}
            onPress={() => setHorario(h)}
          >
            <Text style={styles.horarioTexto}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitleAgen}>Tipo de Consulta:</Text>
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBotao, tipoConsulta === 'Online' && styles.tipoSelecionado]}
          onPress={() => setTipoConsulta('Online')}
        >
          <Text style={styles.tipoTexto}>Online</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipoBotao, tipoConsulta === 'Presencial' && styles.tipoSelecionado]}
          onPress={() => setTipoConsulta('Presencial')
          }
        >
          <Text style={styles.tipoTexto}>Presencial</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.zapzapButton} 
        onPress={handleAgendar}
        disabled={!dataSelecionada || !horario || !tipoConsulta}>
          <Image
            source={{ uri: 'https://web.whatsapp.com/favicon-64x64.ico' }} 
            style={styles.buttonImageIconStyle}
          />
          <View style={styles.buttonIconSeparatorStyle}/>
        <Text style={styles.buttonTextStyle}>Agendar no WhatsApp</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const FuncSobreNos = () => (
  <View style={styles.container3}>
    <Text style={styles.title3}>EquilibraMente</Text>
    <Text style={styles.description}>
      O EquilibraMente é um projeto desenvolvido para a faculdade, com o objetivo de auxiliar uma psicóloga
      a captar novos pacientes e oferecer ferramentas para promover o bem-estar mental.
    </Text>
    <Text style={styles.creators}>Criado por:</Text>
    <Text style={styles.names}>Brunna Mendanha, Emanuele Araújo, Gustavo Carvalho, Welinton Lima</Text>
    <Text style={styles.version}>Versão 1.0</Text>
  </View>
);

const avisosData = [
  {
    id: '1',
    titulo: '🎄 Recesso de Fim de Ano',
    descricao: 'Estaremos em recesso de 20 de dezembro a 5 de janeiro. Planeje suas consultas!',
    data: '04/11/2024',
  },
  {
    id: '2',
    titulo: '🏷️ Promoções de Consultas Online',
    descricao: 'Em julho, teremos promoções especiais para consultas online! Não percam!',
    data: '01/11/2024',
  },
  {
    id: '3',
    titulo: '📍 Mudamos de endereço',
    descricao: 'Estamos de endereço novo! Venha nos visitar na Avenida Maria Teresa, n⁰75 em Campo Grande',
    data: '15/09/2024',
  },


];

const TabAvisos = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={avisosData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.avisoContainer}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.data}>{item.data}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Sem avisos no momento!</Text>}
      />
    </View>
  );
};

const App = () => {
  const [EstaLogado, setLogado] = useState(false);

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Dicas" component={FuncDicas} options={{ title: 'Dicas de Saúde' }} />
      <Stack.Screen name="Respiracao" component={FuncRespiracao} options={{ title: 'Exercício de Respiração' }} />
      <Stack.Screen name="Agendamento" component={FuncAgendamento} options={{ title: 'Agendamentos' }} />
      <Stack.Screen name="SobreNos" component={FuncSobreNos} options={{ title: 'Sobre Nós' }} />
    </Stack.Navigator>
  ); 

  const HomeTab = () => (
    <Tab.Navigator>
      <Tab.Screen 
        name="Início" 
        component={HomeStack} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Avisos" 
        component={TabAvisos} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="alert-circle-outline" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {EstaLogado ? (
        <Stack.Navigator>
        <Stack.Screen name="EquilibraMente" component={HomeTab} options={{ headerShown: true }} />
      </Stack.Navigator>
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
    <ImageBackground source={image3} style={styles.backgroundImage}>
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Bem-vindo(a) ao EquilibraMente</Text>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Dicas')}
      >
        <Text style={styles.optionButtonText}>Dicas de Saúde</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Respiracao')}
      >
        <Text style={styles.optionButtonText}>Exercício de Respiração</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Agendamento')}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
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
    width: 100,
    height: 100,
    marginBottom: 20,
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
  dicaContainer: {
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    marginVertical: 10,
  },
  dicaTexto: {
    fontSize: 16,
    color: '#333',
  },
  videoContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gif: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  containerAgen: { 
    flex: 1,
    padding: 20 
  },
  titleAgen: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitleAgen: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  horario: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 5
  },
  horarioSelecionado: {
    backgroundColor: '#ADD8E6'
  },
  horarioTexto: { color: '#333'
  },
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  tipoBotao: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  tipoSelecionado: {
    backgroundColor: '#ADD8E6'
  },
  tipoTexto: {
    color: '#333'
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  zapzapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#31cc5a',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  buttonImageIconStyle: {
    padding: 10,
    margin: 10,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  buttonIconSeparatorStyle: {
    backgroundColor: 'fff',
    width: 1,
    height: 40,
  },
  buttonTextStyle: {
    color: '#fff',
    marginBottom: 4,
    marginLeft: 10,
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title3: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  creators: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  names: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
  },
  version: {
    fontSize: 14,
    marginTop: 30,
    color: '#999',
  },
  avisoContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 16,
    color: '#333',
  },
  data: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});

export default App;
