import type { AxiosInstance } from "axios";
import type { BookingDto,  BookingQuery,  CreateBookingDto,  PaginatedResponseBooking } from "../types/booking";
import {BookingStatus} from "../types/booking";

export const bookingService = {
    
    getAll: (api: AxiosInstance, query?: BookingQuery ) =>
        api.get<PaginatedResponseBooking>("/booking/", { params:query }),

    getOne: (api: AxiosInstance, id: number) =>
        api.get<BookingDto>(`/booking/${id}`),

    create: (api: AxiosInstance, dto: CreateBookingDto) => 
         api.post<BookingDto>("/booking/", dto),

    delete: (api: AxiosInstance, id: number) => 
        api.delete(`/booking/${id}`),

    updateStatus: (api: AxiosInstance, id: number, status: BookingStatus) =>
        api.patch<BookingStatus>(`/booking/${id}`, { status })
}