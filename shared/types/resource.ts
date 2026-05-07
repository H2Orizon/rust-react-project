export type ResourceDto = {
    id: number
    name: string
    description:string
    price: number
    capacity: number
    availble_now: number
    next_available_at: string | Date
    location?: string
    category: string
    username: string
    user_id: number
}
export type ResourceListDto = {
    id: number
    name: string
    price: number
    capacity: number
    availble_now: number
    location?: string
    category: string
}

export type CreateResourceDto = {
    name: string
    description:string
    price: number
    capacity?: number
    location?: string
    category_id: number
    auto_approve: boolean
}

export type PaginatedResponse = {
    resources: ResourceListDto[]
    total: number
    page: number
    per_page: number
    total_pages: number
}

export type ResourceQuery = {
    user_id?: number
    resource_name?: string
    category?: number
    min_price?: number
    max_price?: number
    per_page?: number
    page?: number
}