import type { AxiosInstance } from "axios";
import type { CreateResourceDto, ResourceDto, PaginatedResponse, ResourceQuery,} from "../types/resource";

export const resourceService = {
    getAll: (api: AxiosInstance, query?: ResourceQuery) => 
        api.get<PaginatedResponse>("/resources/", {params: query }),

    getOne: (api: AxiosInstance, id: number) =>
        api.get<ResourceDto>(`/resources/${id}`),

    create: (api: AxiosInstance, dto: CreateResourceDto) =>
        api.post<ResourceDto>("/resources/", dto),

    delete: (api: AxiosInstance, id: number) =>
        api.delete(`/resources/${id}`),
}