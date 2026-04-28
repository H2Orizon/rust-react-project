import { createContext, useContext, useState, type ReactNode } from "react"
import { decodeToken } from "../utiles/jwt"
import { useNavigate } from "react-router-dom"

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
    
    const navigator = useNavigate()

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    )

    const login = (token: string) => {
        localStorage.setItem("token", token)
        setToken(token)

        const decode = decodeToken(token)
        
        setUser({
            id: decode.sub,
            username: decode.username,
            role: decode.role
        })

    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        navigator("/")
    }

    const [user, setUser] = useState<User | null>(() =>{
        const token = localStorage.getItem("token")
        if (!token) return null
        const decode = decodeToken(token)
        return{
            id: decode.sub,
            username: decode.username,
            role: decode.role
        }
    })

    return (
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
