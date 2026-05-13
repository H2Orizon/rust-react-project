import { getBookings } from "@/api/bookings"
import { PaginatedResponseBooking, BookingQuery, BookingStatus } from "@shared/types/booking"
import BookingCard from "../booking/BookingCard"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import {Picker} from "@react-native-picker/picker"

type Props = {
    userId: number
}

export default function UserBooking({userId}: Props){
    const [userBooking, setBookingDto] = useState<PaginatedResponseBooking>()
    const [bookingQuery, setBookingQuery] = useState<BookingQuery>({
        user_id: userId,
        status: undefined
    })

    useEffect(() => {
        if (!bookingQuery.user_id) return

        getBookings(bookingQuery).then(setBookingDto)
    }, [bookingQuery])

     const bookings = userBooking?.bookings || []

    return(
        <View>
            <Text>
                Your Booking
            </Text>
            <View>
                <Picker
                    selectedValue={bookingQuery.status || ""}
                    onValueChange={(value) =>
                        setBookingQuery(prey => ({
                            ...prey,
                            status: value === ""
                            ? undefined
                            : value as BookingStatus
                        }))
                    }
                >
                    <Picker.Item label="All" value={""}/>
                    {Object.entries(BookingStatus).map(([key, value]) => (
                        <Picker.Item key={key} label={key} value={value} />
                    ))}
                </Picker>
            </View>
            {Array.isArray(bookings) && bookings.map(b => 
                <BookingCard key={b.id} booking={b}/>
            )}
        </View>
    )
}