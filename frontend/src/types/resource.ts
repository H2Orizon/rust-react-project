export type ResourceDto = {
    id: number
    name: string
    description:string
    price: number
    capacity: number
    location?: string
    category: string
    username: string,
    user_id: number
}

export type CreateResourceDto = {
    name: string
    description:string
    price: number
    capacity?: number
    location?: string
    category_id: number
}