import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client'
import AuthStack from './components/screen_stacks/AuthStack';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './db/config';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function handleAuthState(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthState);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.container}>
      {!user ? <AuthStack /> : <View style={{alignItems:'center', justifyContent: 'center', flex: 1}}><Text>Home</Text></View>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 8,
    paddingEnd: 8
  },
});
