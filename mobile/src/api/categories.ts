import { categoryService } from "@shared/api/categories"
import type { CategoryQuery, CreateCategoryDto } from "@shared/types/category"
import { api } from "../services/api"

export const getCategories = () =>
    categoryService.getAll(api).then(cat => cat.data)

export const createCategory = (dto: CreateCategoryDto) =>
    categoryService.create(api, dto).then(cat => cat.data)

export const updateCategory = (dto: CreateCategoryDto, id:number) =>
    categoryService.update(api, id, dto).then(cat => cat.data)

export const getAllCategoryAdmin = (query?: CategoryQuery) =>
    categoryService.getAllCategoryAdmin(api, query).then(cat => cat.data)