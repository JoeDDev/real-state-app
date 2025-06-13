import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContext } from '@/utils/authContext';
import { useContext } from 'react';

export default function ProtectedLayout() {
  console.log("INGRESO")
  const authState = useContext(AuthContext)
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    console.log('Esperando carga de fuentes...');
    return null;
  }

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    console.log("Renderizando loggin-screen")
    return <Redirect href="/loggin-screen"/>
  } 
  console.log("Renderizando tabs")
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="propertie-view" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
