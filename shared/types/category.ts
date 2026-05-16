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