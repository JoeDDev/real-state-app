import { AuthContext } from '@/utils/authContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import {
    Alert,
    Button,
    Platform,
    SafeAreaView, ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function Action(){
    const {action, titulo, id} = useLocalSearchParams();
    const actionNumber = Number(action);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const authState = useContext(AuthContext)
    const showDatePicker = () => setShowPicker(true);

    const onChangeDate = (_event: any, selectedDate?: Date) => {
        if (Platform.OS !== 'web') setShowPicker(false);
        if (selectedDate) setDate(selectedDate);
      };

    const handleCreateInquiry = async () => {
        try {
          const response = await fetch('https://9edc-2803-d100-9920-505-9d6e-ee02-2895-d3f0.ngrok-free.app/inquiries/createInquirie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authState.token}`
            },
            body: JSON.stringify({
              user_id: authState.id,
              property_id: Number(id),
              message: message,
            }),
          });
    
          if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
          }
    
          Alert.alert("Éxito", "Consulta creada correctamente.");
          setMessage("");
        } catch (error) {
            console.log(error)
          Alert.alert("Error",  "Ocurrió un error al crear la consulta.");
        }
      };
    
    const handleCreateAppointment = async () => {
        if (!date || !notes) {
            Alert.alert('Campos incompletos', 'Por favor completa la fecha y la nota.');
            return;
            }
        try {
            setLoading(true);

            const response = await fetch('https://9edc-2803-d100-9920-505-9d6e-ee02-2895-d3f0.ngrok-free.app/appointments/createAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImlhdCI6MTc0OTgyMzQ2NCwiZXhwIjoxNzQ5ODI3MDY0fQ.4ZnG1wi4DkHLG4sI1-YNR6HMm748_813UmW0ZUsmKFk',
            },
            body: JSON.stringify({
                user_id: authState.id,
                property_id: id,
                scheduled_at: new Date().toISOString(),
                status: 1,
                notes: notes,
            }),
            });

            const data = await response.json();

            if (response.ok) {
            Alert.alert('Éxito', 'Cita creada correctamente');
            } else {
            Alert.alert('Error', data.message || 'Hubo un problema');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
            {actionNumber === 1 && (
                <View style={styles.info}>
                    <Text>Una cita</Text>
                    {Platform.OS === 'web' ? (
                        <View style={{ marginBottom: 10 }}>
                        <Text>Selecciona fecha y hora:</Text>
                        <input
                            type="datetime-local"
                            value={new Date(date).toISOString().slice(0, 16)} // yyyy-MM-ddTHH:mm
                            onChange={(e) => setDate(new Date(e.target.value))}
                            style={{
                            padding: 10,
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            marginTop: 5
                            }}
                        />
                        </View>
                    ) : (
                        <>
                        <TouchableOpacity onPress={() => setShowPicker(true)} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 8 }}>
                            <Text>Fecha y hora: {date.toLocaleString()}</Text>
                        </TouchableOpacity>
                        {showPicker && (
                            <DateTimePicker
                            value={date}
                            mode="datetime"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={onChangeDate}
                            />
                        )}
                        </>
                    )}


                    <Text>Notas</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Notas de la cita"
                        multiline
                    />

                    <Button
                        title={loading ? 'Creando...' : 'Crear'}
                        onPress={handleCreateAppointment}
                        disabled={loading}
                    />
                </View>
            )}
            {actionNumber === 2 && (
                <View style={styles.info}>
                    <Text>Realizar consulta sobre propiedad:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe tu mensaje"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <Button
                        title="Crear"
                        onPress={handleCreateInquiry}
                    />
            </View>
            )}
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
    input:{
        width: '100%',
        height: '40%',
        backgroundColor: '#fff',
        color: 'black',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateButton: {
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
      },
  });