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
}