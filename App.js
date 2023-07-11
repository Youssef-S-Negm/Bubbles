import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'expo-dev-client'
import AuthStack from './components/screen_stacks/AuthStack';

export default function App() {
  return (
    <View style={styles.container}>
      <AuthStack />
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
