import { AuthContext } from '@/utils/authContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const isWeb = Platform.OS === 'web';

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const authState = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = () => {
      axios.get(`https://9edc-2803-d100-9920-505-9d6e-ee02-2895-d3f0.ngrok-free.app/appointments/getAppointmentsByClient/4`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      })
      .then(response => {
        const data = response.data?.data?.appointments || [];
        setAppointments(data);
      })
      .catch(error => {
        console.error('Error al obtener citas:', error);
      });
    };

    fetchAppointments(); // Llamada inicial
    const intervalId = setInterval(fetchAppointments, 2000); // cada 30 segundos

    return () => clearInterval(intervalId); // limpieza al desmontar
  }, [authState.token]);


  return (
    <SafeAreaView>
      <ScrollView>
      {appointments.map((appointment) => {
        return (
          <TouchableOpacity
            key={appointment.id}
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/appointment-detail',
                params: {
                  id: appointment.id,
                  property_id: appointment.property_id,
                  scheduled_at: appointment.scheduled_at,
                  notes: appointment.notes,
                  status: appointment.status
                },
              });
            }}
          >
            <View style={styles.data}>
              <Text style={styles.label}>Propiedad ID:</Text>
              <Text>{appointment.property_id}</Text>

              <Text style={styles.label}>Fecha programada:</Text>
              <Text>{new Date(appointment.scheduled_at).toLocaleString()}</Text>

              <Text style={styles.label}>Notas:</Text>
              <Text numberOfLines={2}>{appointment.notes}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isWeb ? 0.1 : 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  data: {
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
});
