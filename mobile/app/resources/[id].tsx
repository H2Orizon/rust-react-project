import { useEffect, useState } from "react"
import { ResourceDto } from "@shared/types/resource"
import { deleteResource, getResource } from "@/api/resources"
import { router, useLocalSearchParams  } from "expo-router"
import { View, Text, ScrollView, Pressable, Modal } from "react-native"

import { styles } from "app/styles/resource.styles"
import { useAuth } from "@/context/AuthContext"
import UpdateResource from "./UpdateResource"
import BookingForm from "./BookingForm"

export default function Resource(){
    const {id} = useLocalSearchParams()
    const {user} = useAuth()

    const [resource, setResource] = useState<ResourceDto>()
    const [error, setError] = useState<string | null>(null)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [openBookingModal, setOpenBookingModal] = useState(false)

    const loadResource = async () => {
        if (!id) return

        const data = await getResource(Number(id))
        setResource(data)
    }

    useEffect(() => {
        if(!id) return

        loadResource()

        getResource(Number(id)).then(setResource)
    }, [id])

    if(!resource){
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                    Loading...
                </Text>
            </View>
        )
    }

    const delete_resource = async (id: number) => {
        try{
            setError(null)
            await deleteResource(id)

            router.push("/")
            
        }catch(error){
            setError("Failed to delete resource")
        }
    }

    return (

        <>
            <ScrollView style={styles.container}>

                {error && (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                )}

                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>
                        Carousel Images
                    </Text>
                </View>

                <View style={styles.content}>

                    <Text style={styles.title}>
                        {resource.name}
                    </Text>

                    <View style={styles.infoContainer}>

                        <View style={styles.infoTag}>
                            <Text style={styles.infoText}>
                                {resource.price}$
                            </Text>
                        </View>

                        <View style={styles.infoTag}>
                            <Text style={styles.infoText}>
                                {resource.capacity}
                            </Text>
                        </View>

                        <View style={styles.infoTag}>
                            <Text style={styles.infoText}>
                                {resource.category}
                            </Text>
                        </View>

                    </View>

                    {resource.availble_now > 0 ? (

                        <Text style={styles.available}>
                            Available:
                            {" "}
                            {resource.availble_now}
                        </Text>

                    ) : (

                        <Text style={styles.unavailable}>
                            Fully booked.
                            {"\n"}
                            Available again at:
                            {"\n"}
                            {new Date(
                                resource.next_available_at
                            ).toLocaleString()}
                        </Text>
                    )}

                    <Text style={styles.description}>
                        {resource.description}
                    </Text>
                    {user?.id &&
                        <Pressable
                            style={styles.bookButton}
                            onPress={() =>
                                setOpenBookingModal(true)
                            }
                        >
                            <Text style={styles.bookButtonText}>
                                Book Now
                            </Text>
                        </Pressable> 
                    }


                    {user?.id === resource.user_id && (

                        <View style={styles.actionGroup}>

                            <Pressable
                                style={styles.deleteButton}
                                onPress={() =>
                                    delete_resource(
                                        resource.id
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.deleteButtonText
                                    }
                                >
                                    Delete Resource
                                </Text>

                            </Pressable>

                            <Pressable
                                style={styles.updateButton}
                                onPress={() =>
                                    setOpenUpdateModal(true)
                                }
                            >
                                <Text
                                    style={
                                        styles.updateButtonText
                                    }
                                >
                                    Update Resource
                                </Text>
                            </Pressable>

                        </View>
                    )}

                </View>

            </ScrollView>

            {/* MODAL */}

            <Modal
                visible={openUpdateModal}
                animationType="slide"
                transparent
                onRequestClose={() =>
                    setOpenUpdateModal(false)
                }
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        <View style={styles.modalHeader}>

                            <Text style={styles.modalTitle}>
                                Update Resource
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setOpenUpdateModal(
                                        false
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.modalClose
                                    }
                                >
                                    ✕
                                </Text>
                            </Pressable>

                        </View>

                        <UpdateResource
                            onUpdated={() =>
                                {
                                    loadResource()
                                    setOpenUpdateModal(false)
                                }
                            }
                            resource={resource}
                        />

                    </View>

                </View>

            </Modal>

            <Modal
                visible={openBookingModal}
                animationType="slide"
                transparent
                onRequestClose={() =>
                    setOpenBookingModal(false)
                }
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        <View style={styles.modalHeader}>

                            <Text style={styles.modalTitle}>
                                Create Booking
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setOpenBookingModal(false)
                                }
                            >
                                <Text style={styles.modalClose}>
                                    ✕
                                </Text>
                            </Pressable>

                        </View>

                        <BookingForm
                            resorsId={resource.id}
                        />

                    </View>

                </View>

            </Modal>
        </>
    )

}