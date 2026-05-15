import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../../components/Booking/BookingForm";
import type { ResourceDto } from "@shared/types/resource";
import { deleteResource, getResource } from "@api/resources";
import UpdateResource from "@/components/Resource/UpdateResourceFrom";
import { deleteResourceImage, uploadResourceImage } from "@/api/images";

export default function Resource() {

    const { user } = useAuth()
    const { id } = useParams()

    const [resource, setResource] = useState<ResourceDto>()
    const [error, setError] = useState<string | null>(null)

    const [showBooking, setShowBooking] =  useState(false)
    const [showEdit, setShowEdit] = useState(false)

    const [selectFile, setSelectFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)

    const images = resource?.images || []

    const uploadImage = async () => {
        if (!selectFile || !id) return

        try {

            setUploading(true)

            await uploadResourceImage(Number(id), selectFile)

            alert("Image upload")

            setSelectFile(null)
        }catch{

            setError("Failed to upload image")
        }finally{

            setUploading(false)
        }
    }

    const navigator = useNavigate()

    useEffect(() =>{
        if (!id) return

        getResource(Number(id)).then(setResource)
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

    const nextImage = () => {
        if (!images.length) return

        setCurrentImage((prev) =>
            prev === images.length - 1
                ? 0
                : prev + 1
        )
    }

    const prevImage = () => {
        if (!images.length) return

        setCurrentImage((prev) =>
            prev === 0
                ? images.length - 1
                : prev - 1
        )
    }

    return(
        <div className="page-container">

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <div className="page-layout">

                <div className="page-media">

                    <div className="carousel">
                        {images.length ? (
                            <>
                                <div className="carousel-image-wrapper">
                                    <img
                                        className="carousel-image"
                                        src={`http://localhost:8888/uploads/${images[currentImage].path}`}
                                        alt=""
                                    />
                                    {user?.id === resource.user_id && (
                                        <button
                                            className="delete-image-btn"
                                            onClick={async () =>{
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
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            className="carousel-btn left"
                                            onClick={prevImage}
                                        >
                                            ‹
                                        </button>

                                        <button
                                            className="carousel-btn right"
                                            onClick={nextImage}
                                        >
                                            ›
                                        </button>
                                    </>
                                )}

                                <div className="carousel-dots">
                                    {images.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`dot ${
                                                currentImage === index
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setCurrentImage(index)
                                            }
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="media-placeholder">
                                No Images
                            </div>
                        )}
                    </div>

                </div>

                <div className="page-content">

                    <div className="resource-header">

                        <div>
                            <h1 className="resource-title">
                                {resource.name}
                            </h1>

                            <p className="resource-category">
                                {resource.category}
                            </p>
                        </div>

                        {resource.availble_now > 0 ? (
                            <div className="resource-status available">
                                {resource.availble_now} available
                            </div>
                        ) : (
                            <div className="resource-status unavailable">
                                Fully booked
                            </div>
                        )}

                    </div>

                    <div className="resource-meta-grid">

                        <div className="meta-card">

                            <span className="meta-label">
                                Price
                            </span>

                            <strong className="meta-value">
                                ${resource.price}
                            </strong>

                        </div>

                        <div className="meta-card">

                            <span className="meta-label">
                                Capacity
                            </span>

                            <strong className="meta-value">
                                {resource.capacity}
                            </strong>

                        </div>

                        <div className="meta-card">

                            <span className="meta-label">
                                Category
                            </span>

                            <strong className="meta-value">
                                {resource.category}
                            </strong>

                        </div>

                    </div>

                    <div className="resource-description-card">

                        <h3>Description</h3>

                        <p className="page-description">
                            {resource.description}
                        </p>

                    </div>

                    {resource.availble_now <= 0 && (
                        <div className="next-available-box">

                            Available again at:

                            <strong>
                                {" "}
                                {new Date(
                                    resource.next_available_at
                                ).toLocaleString()}
                            </strong>

                        </div>
                    )}

                    <div className="resource-actions">

                        <button
                            className="btn-primary"
                            onClick={() =>
                                setShowBooking(true)
                            }
                        >
                            Book Resource
                        </button>

                        {user?.id === resource.user_id && (
                            <>
                                <button
                                    className="btn-outline"
                                    onClick={() =>
                                        setShowEdit(true)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() =>
                                        delete_resource(resource.id)
                                    }
                                >
                                    Delete
                                </button>

                                <div className="">
                                    <input type="file" accept="image/*" onChange={(e) =>
                                        setSelectFile(e.target.files?.[0] || null)
                                    } />

                                    <button
                                        className="btn-outline"
                                        onClick={uploadImage}
                                        disabled={uploading}
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : "Upload Image"
                                        }
                                    </button>
                                </div>
                            </>
                        )}

                    </div>

                </div>

            </div>

                {showBooking && (
                        <div
                            className="modal-overlay"
                            onClick={() =>
                                setShowBooking(false)
                            }
                        >
                            <div
                                className="modal-window"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <div className="modal-header">

                                    <h2>
                                        Book Resource
                                    </h2>

                                    <button
                                        className="modal-close"
                                        onClick={() =>
                                            setShowBooking(false)
                                        }
                                    >
                                        ✕
                                    </button>

                                </div>

                                <BookingForm
                                    resorsId={Number(id)}
                                />

                            </div>
                        </div>
                    )}
                    {showEdit && (
                        <div
                            className="modal-overlay"
                            onClick={() =>
                                setShowEdit(false)
                            }
                        >
                            <div
                                className="modal-window"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <div className="modal-header">

                                    <h2>
                                        Edit Resource
                                    </h2>

                                    <button
                                        className="modal-close"
                                        onClick={() =>
                                            setShowEdit(false)
                                        }
                                    >
                                        ✕
                                    </button>

                                </div>

                                <UpdateResource
                                    resource={resource}
                                />

                            </div>
                        </div>
                    )}
            </div>
    )

}