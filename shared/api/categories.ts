import type { AxiosInstance } from "axios";
import type { CreateCategoryDto } from "../types/category"

export const categoryService = {
    getAll: (api: AxiosInstance) =>
        api.get("/categories/"),

    create: (api: AxiosInstance, dto: CreateCategoryDto) =>
        api.post("/categories/", dto)
}
