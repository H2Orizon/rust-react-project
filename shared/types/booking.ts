
export type CreateBookingDto = {
    resource_id: number
    user_id: number
    location?: string
    start_date: string | Date
    end_date: string | Date
    quantity?: number 
}

export type BookingDto = {
    id: number
    resource_id: number
    resource_name: string
    username: string
    user_id: number
    lessor_id: number
    location?: string
    start_date: string
    end_date: string
    quantity?: number 
    status: BookingStatus
}

export type BookingQuery = {
    user_id?: number,
    status?: BookingStatus,
    lessor_id?: number
}

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus]

export const BookingStatus = {
    Approved: "approved",
    Rejected: "rejected",
    Cancelled: "cancelled",
    Pending: "pending",
    Completed: "completed"
} as const