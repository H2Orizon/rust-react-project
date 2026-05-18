import { categoryService } from "@shared/api/categories"
import type { CategoryQuery, CreateCategoryDto, UpdateCategoryDto } from "@shared/types/category"
import { api } from "../services/api"

export const getCategories = () =>
    categoryService.getAll(api).then(cat => cat.data)

export const createCategory = (dto: CreateCategoryDto) =>
    categoryService.create(api, dto).then(cat => cat.data)

export const updateCategory = (dto: UpdateCategoryDto, id: number) =>
    categoryService.update(api, id, dto).then(cat => cat.data)

export const getAllCategoryForAdmin = (query?: CategoryQuery) =>
    categoryService.getAllCategoryAdmin(api, query).then(data => data.data)

export const deleteCategory = (id: number) =>
    categoryService.delete(api, id)