import { jwtDecode } from "jwt-decode"

type JwtPayload = {
    sub: number
    username: string
    role: string
}

export function decodeToken(token: string): JwtPayload{
    return jwtDecode<JwtPayload>(token)
}