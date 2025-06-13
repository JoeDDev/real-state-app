import { AuthContext } from '@/utils/authContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const isWeb = Platform.OS === 'web';

export default function ClientView() {
  const [properties, setProperties] = useState([]);
  const authState = useContext(AuthContext)
  const router = useRouter();

  useEffect(() => {
    const token = 'tu_token_aqui';
  
    axios.get('http://localhost:3000/real-state/properties', {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
    .then(response => {
      const data = response.data?.data?.propertiesData?.data || [];
      setProperties(data);
    })
    .catch(error => {
      console.error('Error al obtener propiedades:', error);
    });
  }, []);

  return (
    <ScrollView>
      {properties.map((property) => {
        const firstImage = property.imagenes?.[2]?.url;

        return (
          <TouchableOpacity 
            key={property.id} 
            style={styles.card} 
            onPress={() => {
              router.push({
                pathname: '/propertie-view',
                params: { titulo: property.titulo, descripcion: property.descripcion, image: firstImage, id: property.id }, // Puedes pasar más si quieres
              });
            }}  
          >
            <View style={styles.data}>
              <Text>{property.titulo}</Text>
            </View>
            <View style={styles.image}>
              {firstImage ? (
                <Image
                  source={{ uri: firstImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Text>Sin imagen</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  data: {
    height: 130,
    width: '60%',
    justifyContent: 'center',
    paddingRight: 10,
  },
  image: {
    height: 130,
    width: '40%',
  },
});
