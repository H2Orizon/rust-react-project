import { useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { BookingStatus, type BookingDto } from "../../../../shared/types/booking"
import { updateBookingStatus } from "../../api/bookings"

type Props = {
    booking: BookingDto
}

export default function BookingCard({booking}: Props) {
    const navigation = useNavigate()
    const { user } = useAuth()
    const canEdit =
        booking.status === BookingStatus.Pending

    const UpdateBookingStatus = async (id: number, status: BookingStatus) =>{
        await updateBookingStatus(id, status)
        window.location.reload()
    }

    return(
        <div
            className="resource-card"

            onClick={() => navigation(`/resources/${booking.resource_id}`)}
        >
            <div className="resource-card-content">
                <h3>{booking.resource_name}</h3>

                <p className="resource-card-description">
                    {booking.username}
                </p>

                <div className="resource-card-meta">
                    <span>Stary date: {new Date(booking.start_date).toLocaleDateString("en-US",{
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }</span>
                    <span>End date: {new Date(booking.end_date).toLocaleDateString("en-US",{
                            day:"numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }</span>
                </div>

                <div className="resource-card-footer">
                    <span>{booking.location || "N/A"}</span>
                    <span>{booking.quantity || "1"}</span>
                    <span>{booking.status}</span>
                </div>
                
                { canEdit &&
                    <div>
                        {user?.id === booking.user_id &&
                            <button onClick={(e) => { 
                                e.stopPropagation()
                                UpdateBookingStatus(booking.id, BookingStatus.Cancelled)
                                }} className="btn danger">
                                Cancel
                            </button>
                        }
                        {user?.id === booking.lessor_id &&
                            <>
                                <button onClick={(e) => { 
                                    e.stopPropagation()
                                    UpdateBookingStatus(booking.id, BookingStatus.Approved)
                                    }} className="btn danger">
                                    Approv
                                </button>

                                <button onClick={(e) => { 
                                    e.stopPropagation()
                                    UpdateBookingStatus(booking.id, BookingStatus.Rejected)
                                    }} className="btn danger">
                                    Reject
                                </button>
                            </>
                        }

                    </div>
                }
            </div>

        </div>
    )
}