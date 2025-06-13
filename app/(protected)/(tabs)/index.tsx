import AdminView from '@/app/admin-view';
import ClientView from '@/app/client-view';
import { AuthContext } from '@/utils/authContext';
import { useContext } from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const authState = useContext(AuthContext)
  const rol: number = Number(JSON.stringify(authState.rol))
  return (
    <SafeAreaView style={styles.container}>
      {rol === 3 && (
        <ClientView/>
      )}
      {(rol === 1 || rol === 2) && (
        <AdminView/>
      )}
      <Text>{rol}</Text>
      <Button title='Logout' onPress={authState.logOut}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
});
