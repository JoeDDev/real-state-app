import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PropertieView() {
    const { titulo, descripcion, image, id  } = useLocalSearchParams();
    const imageUri = typeof image === 'string' ? image : image?.[0] || '';
    const router = useRouter();

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.info}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text>{descripcion}</Text>
                <Image
                    source={{uri: typeof image === 'string' ? image : image?.[0] || ''}}
                    style={Platform.select({
                    web: { width: 600, height: 400, marginTop: 10 },
                    default: { width: '100%', height: 250, marginTop: 10 }
                    })}
                    resizeMode="cover"
                />
                <View style={styles.actions}>
                    <Button title={'Crear Cita'} 
                        onPress={() => {
                            router.push({
                              pathname: '/action',
                              params: { action: 1, titulo: titulo, id: id}, // Puedes pasar más si quieres
                            });
                        }}
                    />
                    <Button title={'Realizar consulta'} 
                        onPress={() => {
                            router.push({
                              pathname: '/action',
                              params: { action: 2, titulo: titulo, id: id}, // Puedes pasar más si quieres
                            });
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    info: {
        margin: 20
    },
    titulo: {
        fontSize: 30
    },
    actions: {
        flexDirection: 'row'
    }
  });