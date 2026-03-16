import { api } from "../services/api";
import type { ResgisterUser, UserLogin } from "../types/users";

export const registerUser = async (dto: ResgisterUser) => 
    api.post<ResgisterUser>("/user/register", dto).then(res => res.data)


export const loginUser = async (dto: UserLogin) => 
    api.post<string>("/user/login", dto).then(res => res.data)
