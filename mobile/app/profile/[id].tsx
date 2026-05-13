import { getProfile } from "@/api/users"
import { UserDto } from "@shared/types/users"
import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native"
import UserResources from "../user/UserResources"
import UserBooking from "../user/UserBooking"
import UserBookingAprove from "../user/UsersBookingAprove"
import { useLocalSearchParams } from "expo-router"

import {styles} from "app/styles/profile.styles"

type TabType =
    | "resources"
    | "bookings"
    | "requests"

export default function Profile() {
    

    const [userProfile, setUserProfile] = useState<UserDto>()
    const [activeTab, setActiveTab] = useState<TabType>()

    const params = useLocalSearchParams()
    const userId = Array.isArray(params.id)
    ? Number(params.id[0])
    : Number(params.id)

    useEffect(() => {
        if (!userId) return

        setActiveTab("resources")
        
        getProfile(Number(userId)).then(setUserProfile)

    }, [userId])


    if (!userProfile){
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large"/>
                <Text style={styles.loadingText}>
                    Loading...
                </Text>
            </View>
        )
    }

    return(
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.profileCard}>

                <Text style={styles.username}>
                    {userProfile.username}
                </Text>

                <Text style={styles.email}>
                    {userProfile.email}
                </Text>

                <View style={styles.infoContainer}>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>
                            {userProfile.phone || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Staus</Text>
                        <Text style={[styles.value, 
                            userProfile.is_active 
                            ? styles.active 
                            : styles.inactive
                        ]}>
                            {userProfile.is_active
                            ? "Active"
                            : "Inactive"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>
                            Registered
                        </Text>
                        <Text style={styles.value}>
                            {new Date(
                                userProfile.created_at
                            ).toLocaleString()}
                        </Text>
                    </View>

                </View>

            </View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === "resources" 
                            && styles.activeTabButton
                    ]}
                    onPress={() =>
                        setActiveTab("resources")
                    }
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "resources" &&
                                styles.activeTabText,
                        ]}
                    >
                        Resources
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === "bookings" 
                            && styles.activeTabButton
                    ]}
                    onPress={() =>
                        setActiveTab("bookings")
                    }
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "bookings" &&
                                styles.activeTabText,
                        ]}
                    >
                        Bookings
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === "requests" 
                            && styles.activeTabButton
                    ]}
                    onPress={() =>
                        setActiveTab("requests")
                    }
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "requests" &&
                                styles.activeTabText,
                        ]}
                    >
                        Requests
                    </Text>
                </TouchableOpacity>
                </View>
                
                <View style={styles.section}>
                    {activeTab === "resources" && (
                        <>
                            <Text
                                style={styles.sectionTitle}
                            >
                                User Resources
                            </Text>

                            <UserResources
                                userId={Number(userId)}
                            />
                        </>
                    )}

                    {activeTab === "bookings" && (
                        <>
                            <Text
                                style={styles.sectionTitle}
                            >
                                Your Bookings
                            </Text>

                            <UserBooking
                                userId={Number(userId)}
                            />
                        </>
                    )}

                    {activeTab === "requests" && (
                        <>
                            <Text
                                style={styles.sectionTitle}
                            >
                                Booking Requests
                            </Text>

                            <UserBookingAprove
                                userId={Number(userId)}
                            />
                        </>
                    )}
                </View>
        </ScrollView>
       
    )
}