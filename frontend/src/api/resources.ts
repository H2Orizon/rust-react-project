import { api } from "../services/api";
import type { CreateResourceDto, ResourceDto, ResourceListDto} from "../types/resource";

export const getResources = (user_id?: number) => 
    api.get<ResourceListDto[]>("resources", {
        params:{
            user_id
        }
    }).then(res => res.data)

export const getResource = (id: number) =>
    api.get<ResourceDto>(`/resources/${id}`).then(res => res.data)

export const createResource = (dto: CreateResourceDto) =>
    api.post<ResourceDto>("/resources", dto).then(res => res.data)

export const deleteResourceApi = (id: number) =>
    api.delete(`/resources/${id}`)