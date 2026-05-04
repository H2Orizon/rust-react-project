import { bookingService } from "../../../shared/api/bookings"
import type { BookingQuery, BookingStatus, CreateBookingDto } from "../../../shared/types/booking"
import { api } from "../services/api"

export const getBookings = (query?: BookingQuery) =>
    bookingService.getAll(api, query).then(res => res.data)

export const getBooking = (id: number) =>
    bookingService.getOne(api, id).then(res => res.data)

export const createBooking = (dto: CreateBookingDto) =>
    bookingService.create(api, dto).then(res => res.data)

export const updateBookingStatus = (id: number, status: BookingStatus) =>
    bookingService.updateStatus(api, id, status).then(res => res.data)

export const deletBooking = (id: number) =>
    bookingService.delete(api, id)