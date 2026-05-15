import { api } from "@/services/api"
import { imageService } from "@shared/api/images"

export const uploadResourceImage = (resourceId: number, file: File) =>
    imageService.upload(api, resourceId, file).then(resourceId => resourceId.data)

export const deleteResourceImage = (resourceId: number, imageId:number) =>
    imageService.delete(api, resourceId, imageId)