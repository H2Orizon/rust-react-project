import { getBookings } from "@/api/bookings"
import { PaginatedResponseBooking, BookingQuery, BookingStatus } from "@shared/types/booking"
import BookingCard from "../booking/BookingCard"
import { useEffect, useState } from "react"
import { View, Text} from "react-native"

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
        <View>
            <Text>Bookings need aprove</Text>
            {Array.isArray(userBooking?.bookings) && userBooking.bookings.map(b =>
                <BookingCard key={b.id} booking={b}/>
            )}
        </View>
    )

}