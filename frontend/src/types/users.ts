export type ResgisterUser = {
    username: string
    email: string
    phone?: string
    city?: string
    password: string
    password_conf: string
}

export type UserLogin = {
    email: string
    password: string
}

export type AuthResponse = {
    acces_token: string
    refresh_token: string
}