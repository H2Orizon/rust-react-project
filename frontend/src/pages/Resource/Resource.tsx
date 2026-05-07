import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../../components/Booking/BookingForm";
import type { ResourceDto } from "../../../../shared/types/resource";
import { deleteResource, getResource } from "../../api/resources";

export default function Resource() {

    const { user } = useAuth()
    const { id } = useParams()

    const [resource, setResources] = useState<ResourceDto>()
    const [error, setError] = useState<string | null>(null)
    const navigator = useNavigate()

    useEffect(() =>{
        if (!id) return

        getResource(Number(id)).then(setResources)
    }, [id])

    if (!resource){
        return <div>Loading...</div>
    }

    const delete_resource = async (id: number) => {
        try {
            setError(null)
            await deleteResource(id)
            navigator("/")
        }catch(error){
            setError("Failed to delete resource")
        }
    }

    return(
    <div className="page-container">

        {error && <p className="error">{error}</p>}

        <div className="page-layout">

            <div className="page-media">
                <div className="media-placeholder">
                    Carousel Images
                </div>
            </div>

            <div className="page-content">
                <h1>{resource.name}</h1>

                <div className="page-meta">
                    <span>Price: {resource.price}$</span>
                    <span>Capacity: {resource.capacity}</span>
                    <span>Category: {resource.category}</span>
                    {resource.availble_now > 0 ? (
                        <p>Available: {resource.availble_now}</p>
                    ) : (
                        <p>
                            Fully booked.
                            Available again at: {new Date(resource.next_available_at).toLocaleString()}
                        </p>
                    )}
                </div>

                <p className="page-description">
                    {resource.description}
                </p>
                
                { user?.id === resource.user_id && (
                    <button
                        className="btn-danger"
                        onClick={() => delete_resource(resource.id)}
                    >
                        Delete
                    </button>
                )}


            </div>

        </div>
        <BookingForm resorsId={Number(id)}/>
    </div>
    )

}