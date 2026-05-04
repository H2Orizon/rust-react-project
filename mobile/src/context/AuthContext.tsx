import { useRouter } from "expo-router"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import {decodeToken} from "../../../shared/utile/jtw"

type User = {
    id: number
    username: string
    role: string
}

type AuthContextType = {
    token: string | null
    user: User | null
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: ReactNode}) {
    const router = useRouter()

    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() =>{
        const loadToken = async () => {
            const storedToken = await SecureStore.getItemAsync("token")

            if(storedToken){
                setToken(storedToken)

                const decode = decodeToken(storedToken)
                setUser({
                    id: decode.sub,
                    username: decode.username,
                    role: decode.username
                })
            }
        }

        loadToken()
    }, [])

    const login = async (token: string) => {
        await SecureStore.setItemAsync("token", token)
        setToken(token)

        const decode = decodeToken(token)
        setUser({
            id: decode.sub,
            username: decode.username,
            role: decode.role
        })
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync("token")
        setToken(null)
        setUser(null)

        router.replace("/")
    }

    return(
        <AuthContext.Provider value={{token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context){
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}