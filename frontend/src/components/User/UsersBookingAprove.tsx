import { useEffect, useState } from "react";
import BookingCard from "../Booking/BookingCard";
import { BookingStatus, type PaginatedResponseBooking, type BookingQuery } from "@shared/types/booking";
import { getBookings } from "@api/bookings";

type Props = {
    userId: number
}

export default function UserBookingAprove({userId}: Props) {

    const [userBooking, setBookingDto] = useState<PaginatedResponseBooking>()
    const [bookingQueru] = useState<BookingQuery>({
            lessor_id: userId,
            status: BookingStatus.Pending
    })

    useEffect(() => {
        if (!userId) return

        getBookings(bookingQueru).then(setBookingDto)
    }, [bookingQueru])
    
    return(
        <div>
            <h2>Bookings need aprove</h2>
            {Array.isArray(userBooking?.bookings) && userBooking.bookings.map(b =>
                <BookingCard key={b.id} booking={b}/>
            )}
        </div>
    )
}