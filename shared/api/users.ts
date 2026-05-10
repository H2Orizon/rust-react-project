import type { AxiosInstance } from "axios";
import type { RegisterUserDto, UserDto, UserLoginDto } from "../types/users";

export const userService = {
    register: (api: AxiosInstance, dto: RegisterUserDto) =>
        api.post<UserDto>("/user/register", dto),

    login: (api: AxiosInstance, dto: UserLoginDto) =>
        api.post<string>("/user/login", dto),

    getProfile: (api: AxiosInstance, id: number) =>
        api.get<UserDto>(`/user/${id}`)
}