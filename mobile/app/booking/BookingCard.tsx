import { updateBookingStatus } from "@/api/bookings"
import { useAuth } from "@/context/AuthContext"
import { BookingDto, BookingStatus } from "@shared/types/booking"
import { Link, router } from "expo-router"
import { Pressable, View, Text, TouchableOpacity, Alert } from "react-native"


import styles from "../styles/booking-card.styles"

type Props = {
    booking: BookingDto
}

export default function BookingCard({booking}: Props){
    const {user} = useAuth()
    const canEdit = 
        booking.status === BookingStatus.Pending

    const handleUpdateStatus = async (
            id: number,
            status: BookingStatus
        ) => {
            try {
                await updateBookingStatus(id, status);

                Alert.alert("Success", "Booking updated")

                router.replace(`../user/${user?.id}`)
            } catch (err) {
                Alert.alert("Error", "Failed to update booking")
            }
    }

    const getStatusStyle = () => {
        switch (booking.status) {
        case BookingStatus.Approved:
            return styles.statusApproved

        case BookingStatus.Rejected:
            return styles.statusRejected

        case BookingStatus.Cancelled:
            return styles.statusCancelled

        default:
            return styles.statusPending
        }
    }

    return(
        <Link href={`/resources/${booking.resource_id}`} asChild>
            <Pressable style={styles.card}>
                <View>
                    <Text style={styles.title}>{booking.resource_name}</Text>
                    <Text style={styles.username}>{booking.username}</Text>

                    <View style={styles.section}>
                        <Text style={styles.label}>Start:
                            <Text style={styles.value}>
                                {" "}
                                {new Date(booking.start_date).toLocaleString()}
                            </Text>
                        </Text>
                        <Text style={styles.label}>End:
                            <Text style={styles.value}>
                                {" "}
                                {new Date(booking.end_date).toLocaleString()}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>
                                Location
                            </Text>
                            <Text style={styles.infoText}>
                                {booking.location || "N/A"}
                            </Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>
                                Quantity
                            </Text>
                            <Text style={styles.infoText}>
                                {booking.quantity || "N/A"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>
                            Status:
                        </Text>

                        <View
                            style={[
                            styles.statusBadge,
                            getStatusStyle(),
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {booking.status}
                            </Text>
                        </View>
                    </View>

                    {canEdit &&
                        <View style={styles.actions}>
                            {user?.id === booking.user_id &&
                                <TouchableOpacity
                                    style={[
                                        styles.button, 
                                        styles.cancelButton
                                    ]}
                                    onPress={() => {
                                        handleUpdateStatus(booking.id, BookingStatus.Cancelled)
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            }

                            {user?.id === booking.lessor_id &&
                                <>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.approveButton
                                        ]}
                                        onPress={() => {
                                            handleUpdateStatus(booking.id, BookingStatus.Approved)
                                        }}
                                    >
                                        <Text style={styles.buttonText}>
                                            Approv
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.rejectButton
                                        ]}
                                        onPress={() =>{
                                            handleUpdateStatus(booking.id, BookingStatus.Rejected)
                                        }}
                                    >
                                        <Text style={styles.buttonText}>
                                            Reject
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    }
                </View>
            </Pressable>
        </Link>

    )
}
