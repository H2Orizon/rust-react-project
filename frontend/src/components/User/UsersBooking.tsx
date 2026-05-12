import React, { useEffect, useState } from "react";
import BookingCard from "../Booking/BookingCard";
import { BookingStatus, type PaginatedResponseBooking, type BookingQuery } from "@shared/types/booking";
import { getBookings } from "@api/bookings";

type Props = {
    userId: number
}

export default function UserBooking({userId}: Props) {

    const [userBooking, setBookingDto] = useState<PaginatedResponseBooking>()
    const [bookingQueru, setBookingQuery] = useState<BookingQuery>({
            user_id: userId,
            resource_name: undefined,
            status: undefined,
            per_page: 10,
            page: 1,
    })

    const totalPage = userBooking?.total_pages || 0
    const currentPage = userBooking?.page || 0
    const per_page = userBooking?.per_page || 0
    const bookings = userBooking?.bookings || []

    useEffect(() => {
        if (!userId) return
        const timeout = setTimeout(() => {
            return () => clearTimeout(timeout)
        }, 300)

        getBookings(bookingQueru).then(setBookingDto)
    }, [bookingQueru])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setBookingQuery(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const mousHandler = (e: React.MouseEvent<HTMLButtonElement>) =>{
        setBookingQuery({
            ...bookingQueru,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }
    
    return(
        <div className="user-booking-page">

            <div className="booking-header">
                <h2>User Bookings</h2>
            </div>

            <div className="page-filter">
                <input 
                    type="text" 
                    name="resource_name"
                    value={bookingQueru.resource_name}
                    onChange={handleChange}
                    placeholder="Search resource..."
                />

                <select name="status" onChange={handleChange}>
                    <option value="">All Categories</option>
                    {Object.entries(BookingStatus).map(([key, value]) => (
                        <option key={key} value={value}>
                            {key}
                        </option>
                    ))}
                </select>

                {[1,10,20,30].map(num => (
                    <button
                        key={num}
                        value={num}
                        name="per_page"
                        onClick={mousHandler}
                        className={
                            `per-page-btn ${
                                per_page === num
                                    ? "active"
                                    : ""
                            }`
                        }
                    >
                        {num}
                    </button>
                ))}
            </div>
            
            <div className="booking-list">
                {Array.isArray(bookings) &&
                bookings.length > 0 ? (
                    bookings.map(b => (
                        <BookingCard
                            key={b.id}
                            booking={b}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        No bookings found
                    </div>
                )}
            </div>

            
            {totalPage > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-arrow"
                        value={currentPage - 1}
                        onClick={mousHandler}
                        disabled={currentPage === 1}
                        name="page"
                    >
                        ←
                    </button>

                    {Array.from({
                        length: totalPage,
                    }).map((_, p) => {
                        const page = p + 1

                        const shouldShow =
                            page === 1 ||
                            page === totalPage ||
                            (page >=
                                currentPage - 1 &&
                                page <=
                                    currentPage + 1)

                        if (!shouldShow) {
                            if (
                                page ===
                                    currentPage - 2 ||
                                page ===
                                    currentPage + 2
                            ) {
                                return (
                                    <span
                                        key={page}
                                        className="pagination-dots"
                                    >
                                        ...
                                    </span>
                                )
                            }

                            return null
                        }

                        return (
                            <button
                                key={page}
                                className={`pagination-btn ${
                                    currentPage === page
                                        ? "active"
                                        : ""
                                }`}
                                name="page"
                                value={page}
                                onClick={mousHandler}
                            >
                                {page}
                            </button>
                        )
                    })}

                    <button
                        className="pagination-arrow"
                        value={currentPage + 1}
                        onClick={mousHandler}
                        disabled={
                            currentPage === totalPage
                        }
                        name="page"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    )
}