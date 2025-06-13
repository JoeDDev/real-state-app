import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
//import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import {
    Alert
} from 'react-native';

type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    token: string | null,
    email: string | null,
    rol: number | null,
    id: number | null,
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => void;   
};

const authStorageKey = "auth-key"

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    token: null,
    email: null,
    rol: null,
    id: null,
    logIn: async () => {},
    logOut: () => {},
})

export function AuthProvider({ children }: PropsWithChildren)  {
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)
    const [id, setId] = useState<number | null>(null)
    const [rol, setRol] = useState<number | null>(null)
    const router = useRouter();

    const storeAuthState = async (state: { isLoggedIn: boolean; token: string | null, email: string | null, rol: number | null, id: number | null }) => {
        try {
            await AsyncStorage.setItem(authStorageKey, JSON.stringify(state))
        } catch (error) {
            console.log("Error guardando ", error)
        }
    }

    const logIn = async (correo: string, password: string) => {
        try {
            const response = await fetch("https://9edc-2803-d100-9920-505-9d6e-ee02-2895-d3f0.ngrok-free.app/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({correo, password})
            })
    
            const data = await response.json()
            console.log(response)
            if(response.status === 200){
                console.log(response.status)
                setEmail(data.data.email)
                setRol(data.data.rol)
                setToken(data.data.token)
                setId(data.data.id)
                setIsLoggedIn(true)
                await storeAuthState({ isLoggedIn: true, token: data.data.token, email: email, rol: rol, id: data.data.id })
                router.replace("/")
            } else {
                console.log(response)
                Alert.alert('Error', 'Datos incorrectos')
            }
            
        } catch (error) {
            console.log(`Login error: ${error}`)
        }
    }
    const logOut = () => {
        setIsLoggedIn(false);
        setToken(null)
        storeAuthState({ isLoggedIn: false, token: null, email: null, rol: null, id: null })
        router.replace("/loggin-screen")
    }

    useEffect(() => {
        const getAuthFromStorage = async () => {
            try {
                const value = await AsyncStorage.getItem(authStorageKey);
                if (value) {
                    const stored = JSON.parse(value)
                    setIsLoggedIn(stored.isLoggedIn)
                    setToken(stored.token)
                }
            } catch (error) {
                console.log("Error fetching from storage", error)
            }
            setIsReady(true)
        }
        getAuthFromStorage()
    }, [])

    return (
        <AuthContext.Provider value={{isReady,isLoggedIn, token, email, rol, id, logIn, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}