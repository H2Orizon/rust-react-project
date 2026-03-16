export type ResourceDto = {
    id: number
    name: string
    description:string
    price: number
    capacity: number
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