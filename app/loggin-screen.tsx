import { AuthContext } from '@/utils/authContext';
import { useContext, useState } from 'react';
import {
    Alert,
    Button,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window')
const isWeb = Platform.OS === 'web'

export default function Loggin(){
    const authContext = useContext(AuthContext)
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('') 
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            await authContext.logIn(email, password)
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Datos incorrectos')
        }
    }

    return(
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={insets.top}
        >
            <TextInput
                style={[styles.input, isWeb && styles.contentWeb]}
                placeholder='Usuario'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                placeholderTextColor='black'
                autoCapitalize='none'
            />
            <TextInput 
                style={[styles.input]}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                placeholderTextColor='black'
                secureTextEntry
            />
            <Button title={'Login'} onPress={handleLogin}/>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        color: 'black',
        borderRadius: 8,
        
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      contentWeb: {
        maxWidth: 400, // Limita el ancho en web
        alignSelf: 'center',
      },
})