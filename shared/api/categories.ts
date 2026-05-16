import type { AxiosInstance } from "axios";
import type { CreateCategoryDto, CategoryQuery, UpdateCategoryDto } from "../types/category"

export const categoryService = {
    getAll: (api: AxiosInstance) =>
        api.get("/categories/"),

    create: (api: AxiosInstance, dto: CreateCategoryDto) =>
        api.post("/admin/", dto),

    update: (api: AxiosInstance, id:number, dto: UpdateCategoryDto) =>
        api.patch(`/admin/${id}`, dto),

    getAllCategoryAdmin: (api: AxiosInstance, query?: CategoryQuery) =>
        api.get("/admin/", { params:query })
}
