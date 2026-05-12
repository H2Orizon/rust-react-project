import { useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { BookingStatus, type BookingDto } from "@shared/types/booking"
import { updateBookingStatus } from "@api/bookings"

type Props = {
    booking: BookingDto
}

export default function BookingCard({booking}: Props) {
    const navigation = useNavigate()
    const { user } = useAuth()
    const canEdit =
        booking.status === BookingStatus.Pending

    const updateStatus = async (id: number, status: BookingStatus) =>{
        await updateBookingStatus(id, status)
        window.location.reload()
    }

    const getStatusClass = () => {

        switch (booking.status) {

            case BookingStatus.Approved:
                return "status-approved"

            case BookingStatus.Rejected:
                return "status-rejected"

            case BookingStatus.Cancelled:
                return "status-cancelled"

            default:
                return "status-pending"
        }
    }

    return (

        <div
            className="booking-card"
            onClick={() =>
                navigation(
                    `/resources/${booking.resource_id}`
                )
            }
        >
            <div className="booking-card-header">
                <div>
                    <h3 className="booking-card-title">
                        {booking.resource_name}
                    </h3>
                    <p className="booking-card-user">
                        {booking.username}
                    </p>
                </div>
                <div
                    className={`status ${getStatusClass()}`}
                >
                    {booking.status}
                </div>

            </div>
            <div className="booking-card-grid">
                <div className="booking-info-box">
                    <span className="booking-label">
                        Start
                    </span>
                    <span className="booking-value">
                        {new Date(
                            booking.start_date
                        ).toLocaleString()}
                    </span>
                </div>
                <div className="booking-info-box">
                    <span className="booking-label">
                        End
                    </span>
                    <span className="booking-value">
                        {new Date(
                            booking.end_date
                        ).toLocaleString()}
                    </span>
                </div>
            </div>
            <div className="booking-card-grid">
                <div className="booking-info-box">
                    <span className="booking-label">
                        Location
                    </span>
                    <span className="booking-value">
                        {booking.location || "N/A"}
                    </span>
                </div>
                <div className="booking-info-box">
                    <span className="booking-label">
                        Quantity
                    </span>
                    <span className="booking-value">
                        {booking.quantity || "1"}
                    </span>
                </div>
            </div>
            {canEdit && (
                <div
                    className="booking-card-actions"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    {user?.id === booking.user_id && (
                        <button
                            className="btn btn-danger"
                            onClick={() =>
                                updateStatus(
                                    booking.id,
                                    BookingStatus.Cancelled
                                )
                            }
                        >
                            Cancel
                        </button>
                    )}
                    {user?.id === booking.lessor_id && (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={() =>
                                    updateStatus(
                                        booking.id,
                                        BookingStatus.Approved
                                    )
                                }
                            >
                                Approve
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={() =>
                                    updateStatus(
                                        booking.id,
                                        BookingStatus.Rejected
                                    )
                                }
                            >
                                Reject
                            </button>

                        </>
                    )}

                </div>
            )}
        </div>
    )
}