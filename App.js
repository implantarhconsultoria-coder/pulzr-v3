import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getApps, initializeApp } from 'firebase/app';

const Tab = createBottomTabNavigator();

const STORAGE_KEY = 'pulzr-session-v1';
const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80';
const PROFILE_PHOTO =
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || ''
};

const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
if (firebaseReady && getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const seedPosts = [
  {
    id: 'post-1',
    user: 'Nathalia Rodrigues',
    avatar: 'NR',
    caption: 'Treino concluido! Disciplina, foco e constancia sempre.',
    workout: 'Peito e Triceps',
    image: DEFAULT_PHOTO,
    likes: 24,
    comments: 12,
    createdAt: 'Agora mesmo'
  },
  {
    id: 'post-2',
    user: 'Marcelo Araujo',
    avatar: 'MA',
    caption: 'Fechando a semana com progressao de carga.',
    workout: 'Pernas',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1200&q=80',
    likes: 18,
    comments: 5,
    createdAt: '12 min'
  }
];

const starterWorkout = [
  { id: 'ex-1', name: 'Supino reto', meta: '4 series', done: true },
  { id: 'ex-2', name: 'Supino inclinado', meta: '4 series', done: true },
  { id: 'ex-3', name: 'Crucifixo', meta: '3 series', done: true },
  { id: 'ex-4', name: 'Triceps testa', meta: '3 series', done: false },
  { id: 'ex-5', name: 'Triceps corda', meta: '3 series', done: false }
];

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#050505',
    card: '#050505',
    text: '#F7FFE9',
    border: 'rgba(214,255,0,0.18)',
    primary: '#D7FF00'
  }
};

function AppShell() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(seedPosts);
  const [stats, setStats] = useState({ workouts: 0, volume: 0, hours: 0 });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.user);
          setStats(parsed.stats || { workouts: 0, volume: 0, hours: 0 });
          setPosts(parsed.posts || seedPosts);
        }
      })
      .finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    if (!booting && user) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, stats, posts }));
    }
  }, [booting, posts, stats, user]);

  const signIn = useCallback((profile) => {
    const normalized = {
      name: profile.name || 'Atleta PULZR',
      email: profile.email,
      phone: profile.phone || '',
      bio: profile.bio || 'Alta performance. Resultados reais.',
      photo: profile.photo || PROFILE_PHOTO
    };
    setUser(normalized);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: normalized, stats, posts }));
  }, [posts, stats]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const publishWorkout = useCallback((entry) => {
    const post = {
      id: `post-${Date.now()}`,
      user: user?.name || 'Atleta PULZR',
      avatar: initials(user?.name || 'PULZR'),
      caption: entry.caption || 'Treino concluido com marca PULZR.',
      workout: entry.workout,
      image: entry.image || DEFAULT_PHOTO,
      likes: 0,
      comments: 0,
      createdAt: 'Agora mesmo'
    };
    setPosts((current) => [post, ...current]);
    setStats((current) => ({
      workouts: current.workouts + 1,
      volume: current.volume + 12,
      hours: Number((current.hours + 1.1).toFixed(1))
    }));
  }, [user]);

  if (booting) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthScreen onAuth={signIn} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#D7FF00',
          tabBarInactiveTintColor: '#8A917B',
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, focused }) => {
            const icons = {
              Feed: focused ? 'home' : 'home-outline',
              Desafios: focused ? 'trophy' : 'trophy-outline',
              Pulso: focused ? 'flash' : 'flash-outline',
              Treinos: focused ? 'barbell' : 'barbell-outline',
              Perfil: focused ? 'person' : 'person-outline'
            };
            return <Ionicons name={icons[route.name]} size={route.name === 'Pulso' ? 30 : 22} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Feed">
          {() => <FeedScreen posts={posts} setPosts={setPosts} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Desafios" component={ChallengesScreen} />
        <Tab.Screen name="Pulso">
          {() => <PulseScreen stats={stats} />}
        </Tab.Screen>
        <Tab.Screen name="Treinos">
          {() => <WorkoutScreen onPublish={publishWorkout} />}
        </Tab.Screen>
        <Tab.Screen name="Perfil">
          {() => <ProfileScreen user={user} setUser={setUser} stats={stats} onLogout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function SplashScreen() {
  return (
    <SafeAreaView style={styles.screenCenter}>
      <View style={styles.logoBolt}>
        <Ionicons name="flash" size={54} color="#050505" />
      </View>
      <Text style={styles.logoText}>PULZR</Text>
      <Text style={styles.subtitle}>PERFORMANCE & PROGRESS</Text>
    </SafeAreaView>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('Nathalia Rodrigues');
  const [email, setEmail] = useState('nathalia.rodrigues@email.com');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [password, setPassword] = useState('pulzr123');

  const submit = () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert('Dados incompletos', 'Informe e-mail valido e senha com pelo menos 6 caracteres.');
      return;
    }
    onAuth({ name: mode === 'signup' ? name : 'Nathalia Rodrigues', email, phone });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.authRoot}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBolt}>
          <Ionicons name="flash" size={50} color="#050505" />
        </View>
        <Text style={styles.logoText}>PULZR</Text>
        <Text style={styles.subtitle}>COMUNIDADE FECHADA FITNESS</Text>

        <View style={styles.authCard}>
          <Segmented value={mode} onChange={setMode} left="Entrar" right="Criar conta" />
          {mode === 'signup' && (
            <Input icon="person-outline" value={name} onChangeText={setName} placeholder="Nome completo" />
          )}
          <Input icon="mail-outline" value={email} onChangeText={setEmail} placeholder="E-mail" keyboardType="email-address" />
          {mode === 'signup' && (
            <Input icon="call-outline" value={phone} onChangeText={setPhone} placeholder="Telefone" keyboardType="phone-pad" />
          )}
          <Input icon="lock-closed-outline" value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry />
          <Pressable style={styles.primaryButton} onPress={submit}>
            <Text style={styles.primaryButtonText}>{mode === 'signup' ? 'CRIAR CONTA' : 'ENTRAR'}</Text>
          </Pressable>
          <Pressable onPress={() => Alert.alert('Recuperacao de senha', 'Fluxo pronto para Firebase Auth quando as chaves forem configuradas.')}> 
            <Text style={styles.inlineLink}>Esqueci minha senha</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FeedScreen({ posts, setPosts }) {
  const likePost = (id) => {
    setPosts((items) => items.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)));
  };

  const commentPost = (id) => {
    setPosts((items) => items.map((post) => (post.id === id ? { ...post, comments: post.comments + 1 } : post)));
  };

  return (
    <AppScreen title="Feed" rightIcon="search-outline">
      <View style={styles.feedTabs}>
        {['Todos', 'Seguindo', 'Desafios'].map((tab, index) => (
          <Text key={tab} style={[styles.feedTab, index === 0 && styles.feedTabActive]}>{tab}</Text>
        ))}
      </View>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={() => likePost(post.id)} onComment={() => commentPost(post.id)} />
      ))}
    </AppScreen>
  );
}

function WorkoutScreen({ onPublish }) {
  const [exercises, setExercises] = useState(starterWorkout);
  const [caption, setCaption] = useState('Como foi seu treino?');
  const [photo, setPhoto] = useState(DEFAULT_PHOTO);
  const completeCount = exercises.filter((item) => item.done).length;

  const toggle = (id) => {
    setExercises((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera bloqueada', 'Autorize a camera para fotografar o treino.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.82, allowsEditing: true, aspect: [4, 5] });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const publish = () => {
    onPublish({ workout: 'Peito e Triceps', image: photo, caption });
    Alert.alert('Treino publicado', 'Seu treino apareceu no feed com a marca PULZR.');
  };

  return (
    <AppScreen title="Treino" rightIcon="ellipsis-vertical">
      <View style={styles.workoutHeader}>
        <View>
          <Text style={styles.workoutTitle}>Peito e Triceps</Text>
          <Text style={styles.muted}>{completeCount} de {exercises.length} exercicios</Text>
        </View>
        <Text style={styles.timer}>45:30</Text>
      </View>

      {exercises.map((item) => (
        <Pressable key={item.id} style={styles.exerciseRow} onPress={() => toggle(item.id)}>
          <View style={styles.exerciseThumb}><Ionicons name="barbell" size={20} color="#D7FF00" /></View>
          <View style={styles.flexOne}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.muted}>{item.meta}</Text>
          </View>
          <Ionicons name={item.done ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={item.done ? '#D7FF00' : '#69715F'} />
        </Pressable>
      ))}

      <View style={styles.completeCard}>
        <Text style={styles.cardTitle}>Concluir treino</Text>
        <PhotoPreview uri={photo} />
        <Pressable style={styles.secondaryButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={18} color="#D7FF00" />
          <Text style={styles.secondaryButtonText}>TIRAR FOTO</Text>
        </Pressable>
        <TextInput value={caption} onChangeText={setCaption} placeholder="Como foi seu treino?" placeholderTextColor="#717761" style={styles.textArea} multiline />
        <Pressable style={styles.primaryButton} onPress={publish}>
          <Text style={styles.primaryButtonText}>FINALIZAR E POSTAR</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

function ChallengesScreen() {
  return (
    <AppScreen title="Desafios" rightIcon="flame-outline">
      <View style={styles.heroPanel}>
        <Ionicons name="trophy" size={42} color="#D7FF00" />
        <Text style={styles.heroTitle}>Semana de Alta Performance</Text>
        <Text style={styles.muted}>Complete 4 treinos e poste 2 fotos com marca d'agua PULZR.</Text>
      </View>
      <Challenge title="Hybrid 4x" progress="72%" meta="Musculacao + cardio" />
      <Challenge title="Foto de finalizacao" progress="50%" meta="2 posts no feed" />
      <Challenge title="Comunidade ativa" progress="88%" meta="Curtir e comentar" />
    </AppScreen>
  );
}

function PulseScreen({ stats }) {
  return (
    <AppScreen title="Pulso" rightIcon="flash-outline">
      <View style={styles.pulseHero}>
        <View style={styles.logoBoltSmall}><Ionicons name="flash" size={34} color="#050505" /></View>
        <Text style={styles.heroTitle}>Seu progresso em tempo real.</Text>
        <Text style={styles.muted}>Treinos, posts e consistencia conectados em um unico pulso.</Text>
      </View>
      <View style={styles.statsGrid}>
        <Stat label="Treinos" value={String(stats.workouts)} />
        <Stat label="Volume" value={`${stats.volume}k`} />
        <Stat label="Horas" value={String(stats.hours)} />
      </View>
      <View style={styles.timelineCard}>
        <Text style={styles.cardTitle}>Atualizacao em tempo real</Text>
        <Text style={styles.muted}>Feed, curtidas e treinos ficam sincronizados localmente agora; Firebase entra assim que as chaves forem configuradas.</Text>
        <Text style={styles.firebaseBadge}>{firebaseReady ? 'Firebase ativo' : 'Firebase preparado'}</Text>
      </View>
    </AppScreen>
  );
}

function ProfileScreen({ user, setUser, stats, onLogout }) {
  const [draft, setDraft] = useState(user);

  useEffect(() => setDraft(user), [user]);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Fotos bloqueadas', 'Autorize o acesso as fotos para alterar o avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.82, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setDraft((current) => ({ ...current, photo: result.assets[0].uri }));
    }
  };

  const save = () => {
    setUser(draft);
    Alert.alert('Perfil salvo', 'Alteracoes salvas no app PULZR.');
  };

  const shareProfile = () => {
    Share.share({ message: `PULZR - ${draft.name}: ${stats.workouts} treinos, ${stats.volume}k de volume e ${stats.hours}h registradas.` });
  };

  return (
    <AppScreen title="Perfil" rightIcon="settings-outline">
      <View style={styles.profileHeader}>
        <Pressable onPress={pickAvatar} style={styles.avatarWrap}>
          <Image source={{ uri: draft.photo }} style={styles.avatarImage} />
          <View style={styles.avatarCamera}><Ionicons name="camera" size={17} color="#050505" /></View>
        </Pressable>
        <Text style={styles.profileName}>{draft.name}</Text>
        <Text style={styles.muted}>Fotos com marca d'agua • Estatisticas basicas</Text>
      </View>

      <View style={styles.statsGrid}>
        <Stat label="Treinos" value={String(stats.workouts)} />
        <Stat label="Volume" value={`${stats.volume}k`} />
        <Stat label="Horas" value={String(stats.hours)} />
      </View>

      <View style={styles.formCard}>
        <Input value={draft.name} onChangeText={(name) => setDraft((current) => ({ ...current, name }))} placeholder="Nome" icon="person-outline" />
        <Input value={draft.phone} onChangeText={(phone) => setDraft((current) => ({ ...current, phone }))} placeholder="Telefone" icon="call-outline" />
        <TextInput value={draft.bio} onChangeText={(bio) => setDraft((current) => ({ ...current, bio }))} placeholder="Bio" placeholderTextColor="#717761" style={styles.textArea} multiline />
        <Pressable style={styles.primaryButton} onPress={save}><Text style={styles.primaryButtonText}>SALVAR ALTERACOES</Text></Pressable>
        <Pressable style={styles.secondaryButton} onPress={shareProfile}><Ionicons name="share-social-outline" size={18} color="#D7FF00" /><Text style={styles.secondaryButtonText}>COMPARTILHAR PERFIL</Text></Pressable>
        <Pressable onPress={onLogout}><Text style={styles.logout}>Sair</Text></Pressable>
      </View>
    </AppScreen>
  );
}

function AppScreen({ title, rightIcon, children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Ionicons name={rightIcon} size={23} color="#F7FFE9" />
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function PostCard({ post, onLike, onComment }) {
  const share = () => Share.share({ message: `PULZR: ${post.user} concluiu ${post.workout}. ${post.caption}` });
  return (
    <View style={styles.postCard}>
      <View style={styles.postHead}>
        <View style={styles.initials}><Text style={styles.initialsText}>{post.avatar}</Text></View>
        <View style={styles.flexOne}>
          <Text style={styles.postUser}>{post.user}</Text>
          <Text style={styles.muted}>{post.createdAt}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={22} color="#F7FFE9" />
      </View>
      <PhotoPreview uri={post.image} />
      <View style={styles.postActions}>
        <Pressable onPress={onLike} style={styles.iconAction}><Ionicons name="heart-outline" size={24} color="#F7FFE9" /><Text style={styles.actionText}>{post.likes}</Text></Pressable>
        <Pressable onPress={onComment} style={styles.iconAction}><Ionicons name="chatbubble-outline" size={23} color="#F7FFE9" /><Text style={styles.actionText}>{post.comments}</Text></Pressable>
        <Pressable onPress={share} style={styles.iconAction}><Ionicons name="share-social-outline" size={23} color="#F7FFE9" /></Pressable>
      </View>
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.hash}>#PULZR #Disciplina #Foco</Text>
    </View>
  );
}

function PhotoPreview({ uri }) {
  return (
    <View style={styles.photoBox}>
      <Image source={{ uri }} style={styles.photo} />
      <View style={styles.watermark}>
        <Ionicons name="flash" size={24} color="#D7FF00" />
        <Text style={styles.watermarkText}>PULZR</Text>
      </View>
    </View>
  );
}

function Challenge({ title, progress, meta }) {
  return (
    <View style={styles.challengeRow}>
      <View style={styles.logoBoltTiny}><Ionicons name="flash" size={19} color="#050505" /></View>
      <View style={styles.flexOne}>
        <Text style={styles.challengeTitle}>{title}</Text>
        <Text style={styles.muted}>{meta}</Text>
      </View>
      <Text style={styles.progress}>{progress}</Text>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Input({ icon, ...props }) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={19} color="#D7FF00" />
      <TextInput placeholderTextColor="#717761" style={styles.input} autoCapitalize="none" {...props} />
    </View>
  );
}

function Segmented({ value, onChange, left, right }) {
  return (
    <View style={styles.segmented}>
      <Pressable style={[styles.segment, value === 'login' && styles.segmentActive]} onPress={() => onChange('login')}>
        <Text style={[styles.segmentText, value === 'login' && styles.segmentTextActive]}>{left}</Text>
      </Pressable>
      <Pressable style={[styles.segment, value === 'signup' && styles.segmentActive]} onPress={() => onChange('signup')}>
        <Text style={[styles.segmentText, value === 'signup' && styles.segmentTextActive]}>{right}</Text>
      </Pressable>
    </View>
  );
}

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050505' },
  screenCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', padding: 24 },
  authRoot: { flex: 1, backgroundColor: '#050505' },
  authScroll: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#050505' },
  scrollContent: { padding: 18, paddingBottom: 108 },
  logoBolt: { alignSelf: 'center', width: 104, height: 104, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D7FF00', shadowColor: '#D7FF00', shadowOpacity: 0.55, shadowRadius: 28, marginBottom: 24 },
  logoBoltSmall: { width: 62, height: 62, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D7FF00', marginBottom: 20 },
  logoBoltTiny: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D7FF00' },
  logoText: { textAlign: 'center', color: '#F7FFE9', fontSize: 45, fontWeight: '900', letterSpacing: 0 },
  subtitle: { textAlign: 'center', color: '#B7BE9A', fontSize: 11, fontWeight: '700', marginTop: 5, marginBottom: 28 },
  authCard: { gap: 12 },
  segmented: { flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(215,255,0,0.38)', borderRadius: 14, padding: 4, marginBottom: 4 },
  segment: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  segmentActive: { backgroundColor: '#D7FF00' },
  segmentText: { color: '#D7FF00', fontWeight: '800' },
  segmentTextActive: { color: '#050505' },
  inputWrap: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(247,255,233,0.12)', borderRadius: 12, backgroundColor: '#10110D', paddingHorizontal: 14 },
  input: { flex: 1, color: '#F7FFE9', fontSize: 15 },
  primaryButton: { minHeight: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D7FF00', marginTop: 4 },
  primaryButtonText: { color: '#050505', fontWeight: '900' },
  secondaryButton: { minHeight: 50, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: 'rgba(215,255,0,0.36)', backgroundColor: '#0A0A08', marginTop: 10 },
  secondaryButtonText: { color: '#D7FF00', fontWeight: '900' },
  inlineLink: { color: '#D7FF00', textAlign: 'center', fontWeight: '700', marginTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerTitle: { color: '#F7FFE9', fontWeight: '900', fontSize: 18, letterSpacing: 0 },
  feedTabs: { flexDirection: 'row', gap: 18, marginBottom: 18 },
  feedTab: { color: '#858C76', fontWeight: '800' },
  feedTabActive: { color: '#D7FF00', borderBottomWidth: 2, borderBottomColor: '#D7FF00', paddingBottom: 6 },
  postCard: { borderWidth: 1, borderColor: 'rgba(247,255,233,0.12)', borderRadius: 8, padding: 13, backgroundColor: '#0B0C09', marginBottom: 16 },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  initials: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#D7FF00', alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: '#050505', fontWeight: '900' },
  postUser: { color: '#F7FFE9', fontWeight: '800' },
  muted: { color: '#9CA58C', lineHeight: 20 },
  flexOne: { flex: 1 },
  photoBox: { width: '100%', aspectRatio: 0.86, borderRadius: 8, overflow: 'hidden', backgroundColor: '#14150F', borderWidth: 1, borderColor: 'rgba(215,255,0,0.22)' },
  photo: { width: '100%', height: '100%' },
  watermark: { position: 'absolute', right: 14, bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 5 },
  watermarkText: { color: '#F7FFE9', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  postActions: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 12 },
  iconAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { color: '#F7FFE9', fontWeight: '700' },
  caption: { color: '#F7FFE9', fontWeight: '600', marginTop: 12, lineHeight: 21 },
  hash: { color: '#D7FF00', fontWeight: '800', marginTop: 8 },
  workoutHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  workoutTitle: { color: '#F7FFE9', fontSize: 24, fontWeight: '900' },
  timer: { color: '#AEB899', fontWeight: '800' },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 66, borderBottomWidth: 1, borderBottomColor: 'rgba(247,255,233,0.08)' },
  exerciseThumb: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15170F' },
  exerciseName: { color: '#F7FFE9', fontWeight: '800', fontSize: 15 },
  completeCard: { borderWidth: 1, borderColor: 'rgba(215,255,0,0.2)', borderRadius: 8, padding: 13, backgroundColor: '#0B0C09', marginTop: 20, gap: 10 },
  cardTitle: { color: '#F7FFE9', fontSize: 18, fontWeight: '900', marginBottom: 4 },
  textArea: { minHeight: 82, color: '#F7FFE9', borderWidth: 1, borderColor: 'rgba(247,255,233,0.12)', borderRadius: 12, backgroundColor: '#10110D', padding: 14, textAlignVertical: 'top' },
  heroPanel: { borderWidth: 1, borderColor: 'rgba(215,255,0,0.22)', borderRadius: 8, backgroundColor: '#0B0C09', padding: 18, gap: 10, marginBottom: 14 },
  pulseHero: { minHeight: 230, borderWidth: 1, borderColor: 'rgba(215,255,0,0.22)', borderRadius: 8, padding: 20, justifyContent: 'flex-end', backgroundColor: '#0B0C09' },
  heroTitle: { color: '#F7FFE9', fontSize: 30, fontWeight: '900', lineHeight: 34, letterSpacing: 0 },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, borderWidth: 1, borderColor: 'rgba(247,255,233,0.1)', borderRadius: 8, paddingHorizontal: 13, backgroundColor: '#0B0C09', marginBottom: 10 },
  challengeTitle: { color: '#F7FFE9', fontSize: 16, fontWeight: '900' },
  progress: { color: '#D7FF00', fontWeight: '900', fontSize: 18 },
  statsGrid: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 16 },
  statCard: { flex: 1, minHeight: 86, borderWidth: 1, borderColor: 'rgba(247,255,233,0.1)', borderRadius: 8, backgroundColor: '#0B0C09', padding: 12, justifyContent: 'center' },
  statValue: { color: '#D7FF00', fontSize: 25, fontWeight: '900' },
  statLabel: { color: '#9CA58C', fontWeight: '800', marginTop: 4 },
  timelineCard: { borderWidth: 1, borderColor: 'rgba(247,255,233,0.1)', borderRadius: 8, backgroundColor: '#0B0C09', padding: 15 },
  firebaseBadge: { alignSelf: 'flex-start', color: '#050505', backgroundColor: '#D7FF00', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, fontWeight: '900', marginTop: 12 },
  profileHeader: { alignItems: 'center', paddingVertical: 8 },
  avatarWrap: { width: 112, height: 112, borderRadius: 56, marginBottom: 12 },
  avatarImage: { width: '100%', height: '100%', borderRadius: 56, borderWidth: 2, borderColor: '#D7FF00' },
  avatarCamera: { position: 'absolute', right: 0, bottom: 4, width: 35, height: 35, borderRadius: 18, backgroundColor: '#D7FF00', alignItems: 'center', justifyContent: 'center' },
  profileName: { color: '#F7FFE9', fontSize: 24, fontWeight: '900' },
  formCard: { gap: 12, borderWidth: 1, borderColor: 'rgba(247,255,233,0.1)', borderRadius: 8, backgroundColor: '#0B0C09', padding: 13 },
  logout: { color: '#FF7676', textAlign: 'center', fontWeight: '800', marginTop: 8 },
  tabBar: { position: 'absolute', left: 14, right: 14, bottom: 14, height: 72, borderRadius: 8, borderTopWidth: 0, borderWidth: 1, borderColor: 'rgba(215,255,0,0.18)', backgroundColor: '#080906', paddingTop: 8, paddingBottom: 8 }
});

export default function App() {
  return <AppShell />;
}
