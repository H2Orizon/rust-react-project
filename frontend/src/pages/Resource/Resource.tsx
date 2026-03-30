import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { ResourceDto } from "../../types/resource";
import { deleteResourceApi, getResource } from "../../api/resources";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../../components/Booking/BookingForm";

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

    const deleteResource = async (id: number) => {
        try {
            setError(null)
            await deleteResourceApi(id)
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
                </div>

                <p className="page-description">
                    {resource.description}
                </p>
                
                { user?.id === resource.user_id && (
                    <button
                        className="btn-danger"
                        onClick={() => deleteResource(resource.id)}
                    >
                        Delete
                    </button>
                )}


            </div>

        </div>
        <BookingForm />
    </div>
    )

}