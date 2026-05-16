import type { AxiosInstance } from "axios";
import type { CreateCategoryDto, UpdateCategoryDto } from "../types/category"

export const categoryService = {
    getAll: (api: AxiosInstance) =>
        api.get("/categories/"),

    create: (api: AxiosInstance, dto: CreateCategoryDto) =>
        api.post("/categories/", dto),

    update: (api: AxiosInstance, id:number, dto: UpdateCategoryDto) =>
        api.patch(`/categories/${id}`, dto)
}
