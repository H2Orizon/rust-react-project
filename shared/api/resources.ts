import type { AxiosInstance } from "axios";
import type { CreateResourceDto, ResourceDto, ResourceListDto, ResourceQuery,} from "../types/resource";

export const resourceService = {
    getAll: (api: AxiosInstance, query?: ResourceQuery) => 
        api.get<ResourceListDto[]>("/resources/", {params: query }),
    getOne: (api: AxiosInstance, id: number) =>
        api.get<ResourceDto>(`/resources/${id}`),

    create: (api: AxiosInstance, dto: CreateResourceDto) =>
        api.post<ResourceDto>("/resorces/", dto),

    delete: (api: AxiosInstance, id: number) =>
        api.delete(`/resorces/${id}`)
}