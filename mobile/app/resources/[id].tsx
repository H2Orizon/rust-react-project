import { useEffect, useState } from "react"
import { ResourceDto } from "@shared/types/resource"
import { deleteResource, getResource } from "@/api/resources"
import { router, useLocalSearchParams  } from "expo-router"
import { View, Text, ScrollView, Pressable, Modal, Image, TouchableOpacity } from "react-native"
import * as ImagePicker from "expo-image-picker"

import { styles } from "app/styles/resource.styles"
import { useAuth } from "@/context/AuthContext"
import UpdateResource from "./UpdateResource"
import BookingForm from "./BookingForm"
import { api } from "@/services/api"
import { deleteResourceImage } from "@/api/images"

export default function Resource(){
    const {id} = useLocalSearchParams()
    const {user} = useAuth()

    const [resource, setResource] = useState<ResourceDto>()
    const [error, setError] = useState<string | null>(null)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [openBookingModal, setOpenBookingModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [currentImage, setCurrentImage] = useState(0)

    const images = resource?.images || []

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

    const pickImage = async () => {

        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permission.granted) {
            alert("Permission denied")
            return
        }

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes:
                    ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
            })

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri)
        }
    }

    const uploadImage = async () => {

        if (!selectedImage || !resource.id)
            return

        const formData = new FormData()

        formData.append("file", {
            uri: selectedImage,
            name: "image.jpg",
            type: "image/jpeg",
        } as any)

        try {

            await api.post(
                `/resources/${resource.id}/image`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            )

            alert("Image uploaded")

            await loadResource()

            setSelectedImage(null)

        } catch {
            alert("Upload failed")
        }
    }

    const nextImage = () => {

        if (!images?.length) return

        setCurrentImage((prev) =>
            prev === images.length - 1
                ? 0
                : prev + 1
        )
    }

    const prevImage = () => {

        if (!images?.length) return

        setCurrentImage((prev) =>
            prev === 0
                ? images.length - 1
                : prev - 1
        )
    }

    return (

        <>
            <ScrollView style={styles.container}>

                {error && (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                )}

                <View style={styles.carouselContainer}>

                    {images?.length ? (

                        <>
                            <Image
                                source={{
                                    uri:
                                        `${process.env.EXPO_PUBLIC_API_URL}/uploads/${images[currentImage].path}`
                                }}
                                style={styles.carouselImage}
                                resizeMode="cover"
                            />
                            {user?.id === resource.user_id && (
                                <Pressable
                                    style={styles.deleteImageButton}
                                    onPress={async () => {
                                        try{
                                            const image =
                                                images[currentImage]

                                            await deleteResourceImage(
                                                resource.id,
                                                image.id
                                            )

                                            setResource({
                                                ...resource,
                                                images: (resource.images ?? []).filter(
                                                    (_, index) =>
                                                        index !== currentImage
                                                )
                                            })
                                            setCurrentImage(0)
                                        }catch{
                                            setError(
                                                "Failed to delete image"
                                            )
                                        }
                                    }}
                                >
                                    <Text style={styles.deleteImageButtonText}>
                                        ✕
                                    </Text>
                                </Pressable>
                            )}

                            {images.length > 1 && (

                                <>
                                    <Pressable
                                        style={[
                                            styles.carouselButton,
                                            styles.carouselLeft
                                        ]}
                                        onPress={prevImage}
                                    >
                                        <Text
                                            style={styles.carouselButtonText}
                                        >
                                            ‹
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        style={[
                                            styles.carouselButton,
                                            styles.carouselRight
                                        ]}
                                        onPress={nextImage}
                                    >
                                        <Text
                                            style={styles.carouselButtonText}
                                        >
                                            ›
                                        </Text>
                                    </Pressable>
                                </>
                            )}

                            <View style={styles.dotsContainer}>

                                {images.map((_, index) => (

                                    <Pressable
                                        key={index}
                                        onPress={() =>
                                            setCurrentImage(index)
                                        }
                                    >
                                        <View
                                            style={[
                                                styles.dot,
                                                currentImage === index &&
                                                    styles.activeDot
                                            ]}
                                        />
                                    </Pressable>
                                ))}
                            </View>
                        </>

                    ) : (

                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imageText}>
                                No Images
                            </Text>
                        </View>
                    )}

                </View>

                <View style={styles.content}>

                    <Text style={styles.title}>
                        {resource.name}
                    </Text>

                    <View style={styles.infoContainer}>

                        <View style={styles.infoTag}>
                            <Text style={styles.infoText}>
                                ${resource.price}/{resource.payment_for}
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

                            <Pressable
                                style={styles.updateButton}
                                onPress={pickImage}
                            >
                                <Text style={styles.updateButtonText}>
                                    Select Image
                                </Text>
                            </Pressable>

                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{
                                        width: "100%",
                                        height: 220,
                                        borderRadius: 16,
                                        marginTop: 12,
                                    }}
                                    resizeMode="cover"
                                />
                            )}

                            <Pressable
                                style={styles.bookButton}
                                onPress={uploadImage}
                            >
                                <Text style={styles.bookButtonText}>
                                    Upload Image
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