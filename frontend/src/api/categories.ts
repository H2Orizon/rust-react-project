import { categoryService } from "../../../shared/api/categories"
import type { CreateCategoryDto } from "../../../shared/types/category"
import { api } from "../services/api"

export const getCategories = () =>
    categoryService.getAll(api).then(res => res.data)

export const createCategory = (dto: CreateCategoryDto) =>
    categoryService.create(api, dto).then(res => res.data)