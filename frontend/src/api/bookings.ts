import { api } from "../services/api";
import type { BookingQuery, CreateBookingDto } from "../types/booking";

export const createBooking = (dto: CreateBookingDto) => 
    api.post("/booking/", dto).then(bk => bk.data)

export const getBookings = (bookingQuery?: BookingQuery) =>
    api.get("/booking", {
        params: bookingQuery
    }).then(bk => bk.data)

export const getBooking = (id: number) =>
    api.get(`/booking/${id}`).then(bk => bk.data)

export const deletBooking = (id: number) =>
    api.delete(`/booking/${id}`)

export const updateBookingStatus = (id: number, status: string) =>
    api.patch(`/booking/${id}`, {status}).then(bk => bk.data)