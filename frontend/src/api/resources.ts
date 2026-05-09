import { resourceService } from "@shared/api/resources"
import type { ResourceQuery } from "@shared/types/resource"
import { api } from "../services/api"

export const getResources = (query?: ResourceQuery) => 
    resourceService.getAll(api, query).then(res => res.data)

export const getResource = (id: number) =>
    resourceService.getOne(api, id).then(res => res.data)

export const createResource = (dto: any) =>
    resourceService.create(api, dto).then(res => res.data)

export const deleteResource = (id: number) =>
    resourceService.delete(api, id)