import { useEffect, useState } from "react"
import { useParams } from "react-router"
import UserResources from "../../components/User/UsersResources"
import UserBooking from "../../components/User/UsersBooking"
import UserBookingAprove from "../../components/User/UsersBookingAprove"
import { getProfile } from "@/api/users"
import type { UserDto } from "@shared/types/users"

type TabType =
    | "resources"
    | "bookings"
    | "requests"

export default function UserProfile(){

    const {id} = useParams()

    const [userProfile, setUserProfile] = useState<UserDto>()
    const [activeTab, setActiveTab] = useState<TabType>()

    useEffect(() =>{
        if (!id) return

        setActiveTab("resources")

        getProfile(Number(id)).then(setUserProfile)

    }, [id])

    if (!userProfile){
        return <div>Loading...</div>
    }

    
    return (
        <div className="profile-page">

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {userProfile.username
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h1>
                            {userProfile.username}
                        </h1>

                        <p className="profile-email">
                            {userProfile.email}
                        </p>
                    </div>
                </div>

                <div className="profile-info-grid">
                    <div className="profile-info-item">
                        <span className="profile-label">
                            Phone
                        </span>

                        <span className="profile-value">
                            {" " + userProfile.phone ||
                                "N/A"}
                        </span>
                    </div>

                    <div className="profile-info-item">
                        <span className="profile-label">
                            City:
                        </span>

                        <span className="profile-value">
                            {" " + userProfile.city ||
                                "N/A"}
                        </span>
                    </div>

                    <div className="profile-info-item">
                        <span className="profile-label">
                            Status
                        </span>

                        <span
                            className={`profile-status ${
                                userProfile.is_active
                                    ? "active"
                                    : "inactive"
                            }`}
                        >
                            { " " + userProfile.is_active
                                ? "Active"
                                : "Disabled"}
                        </span>
                    </div>

                    <div className="profile-info-item">
                        <span className="profile-label">
                            Registered
                        </span>

                        <span className="profile-value">
                            {" " +  new Date(
                                userProfile.created_at
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>


            <div className="profile-tabs">
                <button
                    className={
                        `profile-tab-btn ${
                            activeTab === "resources"
                                ? "active"
                                : ""
                        }`
                    }
                    onClick={() =>
                        setActiveTab("resources")
                    }
                >
                    Resources
                </button>

                <button
                    className={
                        `profile-tab-btn ${
                            activeTab === "bookings"
                                ? "active"
                                : ""
                        }`
                    }
                    onClick={() =>
                        setActiveTab("bookings")
                    }
                >
                    Bookings
                </button>

                <button
                    className={
                        `profile-tab-btn ${
                            activeTab === "requests"
                                ? "active"
                                : ""
                        }`
                    }
                    onClick={() =>
                        setActiveTab("requests")
                    }
                >
                    Requests
                </button>
            </div>

            <div className="profile-content">
                {activeTab === "resources" && (
                    <UserResources
                        userId={Number(id)}
                    />
                )}

                {activeTab === "bookings" && (
                    <UserBooking
                        userId={Number(id)}
                    />
                )}

                {activeTab === "requests" && (
                    <UserBookingAprove
                        userId={Number(id)}
                    />
                )}
            </div>
        </div>
    )
}