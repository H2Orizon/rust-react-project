import { userService } from "../../../shared/api/users"
import { api } from "../services/api"

export const registerUser = (dto: any) => 
    userService.register(api, dto).then(res => res.data)

export const loginUser = (dto: any) => 
    userService.login(api, dto).then(res => res.data)

export const getProfile = (id:number) =>
    userService.getProfile(api, id).then(res => res.data)
