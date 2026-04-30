import type { AxiosInstance } from "axios";
import type { BookingQuery, BookingStatus, CreateBookingDto } from "../types/booking";

export const bookingService = {
    
    getAll: (api: AxiosInstance, query?: BookingQuery ) =>
        api.get("/booking", { params:query }),

    getOne: (api: AxiosInstance, id: number) =>
        api.get(`/booking/${id}`),

    create: (api: AxiosInstance, dto: CreateBookingDto) => 
         api.post("/booking/", dto),

    delete: (api: AxiosInstance, id: number) => 
        api.delete(`/booking/${id}`),

    updateStatus: (api: AxiosInstance, id: number, status: BookingStatus) =>
        api.patch(`/booking/${id}`, status)
}