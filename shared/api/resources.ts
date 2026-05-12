import type { AxiosInstance } from "axios";
import type { CreateResourceDto, ResourceDto, PaginatedResponseResource, ResourceQuery,} from "../types/resource";

export const resourceService = {
    getAll: (api: AxiosInstance, query?: ResourceQuery) => 
        api.get<PaginatedResponseResource>("/resources/", {params: query }),

    getOne: (api: AxiosInstance, id: number) =>
        api.get<ResourceDto>(`/resources/${id}`),

    create: (api: AxiosInstance, dto: CreateResourceDto) =>
        api.post<ResourceDto>("/resources/", dto),

    update: (api: AxiosInstance, id: number, dto: CreateResourceDto) =>
        api.patch<ResourceDto>(`/resources/${id}`, dto),

    delete: (api: AxiosInstance, id: number) =>
        api.delete(`/resources/${id}`),
}