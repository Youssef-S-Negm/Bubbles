import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'expo-dev-client'
import AuthStack from './components/screen_stacks/AuthStack';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './db/config';
import { getUserById } from './db/users';
import AppStack from './components/screen_stacks/AppStack';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  async function handleAuthState(user) {
    if (user) {
      const dbUser = await getUserById(user.uid)
      setUser(dbUser);
    } else {
      setUser(null)
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthState);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.container}>
      {!user ? <AuthStack /> : <AppStack user={user} setUser={setUser} />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingStart: 8,
    // paddingEnd: 8
  },
});
