export type CategoryDto = {
    id: number
    name: string
    description: string
    is_movable: boolean
}

export type CreateCategoryDto = {
    name: string
    description: string
    is_movable: boolean
}

export type UpdateCategoryDto = {
    name?: string
    description?: string
    is_movable?: boolean
}

export type PaginatedCategory = {
    categories: CategoryDto[]
    total: number
    page: number
    per_page: number
    total_pages: number
}

export type CategoryQuery = {
    name?: string
    description?: string
    is_movable?: boolean
    page?: number
    per_page?: number
}