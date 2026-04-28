import React, { useEffect, useState } from "react";
import { BookingStatus, type BookingDto, type BookingQuery } from "../../types/booking";
import { getBookings } from "../../api/bookings";
import BookingCard from "../Booking/BookingCard";

type Props = {
    userId: number
}

export default function UserBooking({userId}: Props) {

    const [UserBooking, setBookingDto] = useState<BookingDto[]>([])
    const [bookingQueru, setBookingQuery] = useState<BookingQuery>({
            user_id: userId,
            status: undefined,
    })

    useEffect(() => {
        if (!userId) return

        getBookings(bookingQueru).then(setBookingDto)
    }, [bookingQueru])

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBookingQuery(prev => ({
            ...prev,
            status: e.target.value as BookingStatus
        }))
    }
    
    return(
        <div>
            <h2>Your Bookings</h2>
            <select onChange={handleStatusChange}>
                <option value="">All</option>
                {Object.entries(BookingStatus).map(([key, value]) => (
                    <option key={key} value={value}>
                        {key}
                    </option>
                ))}
            </select>
            {Array.isArray(UserBooking) && UserBooking.map(b =>
                <BookingCard key={b.id} booking={b}/>
            )}
        </div>
    )
}