import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/utils/authContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    console.log("Entra aqui")
    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto"/>
            <Stack>
                <Stack.Screen
                    name="(protected)"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="loggin-screen"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="propertie-view"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="action"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>
        </ThemeProvider>
        </AuthProvider>
    )   
}