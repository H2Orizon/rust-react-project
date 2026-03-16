import { api } from "../services/api"
import type { CategoryDto } from "../types/category"


export const getCategories = async (): Promise<CategoryDto[]> => {
    const res = await api.get<CategoryDto[]>("categories")
    return res.data
}