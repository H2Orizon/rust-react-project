import { api } from "../services/api"
import type { CategoryDto, CreateCategory } from "../types/category"

export const getCategories = () =>
    api.get<CategoryDto[]>("categories").then(cat => cat.data)

export const createCategory = (form: CreateCategory) =>
    api.post<CategoryDto>("categories", form).then(cat => cat.data)