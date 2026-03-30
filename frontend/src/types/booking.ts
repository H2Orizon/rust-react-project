
export type CreateBookingDto = {
    resource_id: number
    user_id: number
    location?: string
    start_date: string | Date
    end_date: string | Date
    quantity?: number 
}

export const BookingStatus = {
    Approved: "approved",
    Rejected: "rejected",
    Cancelled: "cancelled"
} as const