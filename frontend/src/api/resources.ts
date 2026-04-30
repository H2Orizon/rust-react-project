import { resourceService } from "../../../shared/api/resources"
import { api } from "../services/api"

export const getResources = (user_id?: number) => 
    resourceService.getAll(api, user_id).then(res => res.data)

export const getResource = (id: number) =>
    resourceService.getOne(api, id).then(res => res.data)

export const createResource = (dto: any) =>
    resourceService.create(api, dto).then(res => res.data)

export const deleteResource = (id: number) =>
    resourceService.delete(api, id)