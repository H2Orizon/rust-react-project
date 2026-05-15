import { useNavigate } from "react-router"
import type { ResourceListDto } from "@shared/types/resource"

type Props = {
    resource: ResourceListDto
}

export default function ResourceCard({resource}: Props) {

    const navigator = useNavigate()

    const image = resource.image || undefined

    console.log(image)
    return (
        <div
            className="resource-card"
            onClick={() =>
                navigator(`/resources/${resource.id}`)
            }
        >
            <div className="resource-card-image">
                {image ? (
                    <img
                        src={`http://localhost:8888/uploads/${image.path}`}
                        alt={resource.name}
                    />
                ) : (
                    <div className="no-image">
                        No Image
                    </div>
                )}
            </div>

            <div className="resource-card-content">
                <div className="resource-card-header">
                    <div>
                        <h3 className="resource-card-title">
                            {resource.name}
                        </h3>
                        <p className="resource-card-category">
                            {resource.category}
                        </p>
                    </div>
                    <div
                        className={`resource-status ${
                            resource.availble_now > 0
                                ? "available"
                                : "unavailable"
                        }`}
                    >
                        {resource.availble_now > 0
                            ? `${resource.availble_now} available`
                            : "Unavailable"}
                    </div>

                </div>
                <div className="resource-card-meta-grid">
                    <div className="resource-card-meta-item">
                        <span className="resource-card-label">
                            Price
                        </span>
                        <strong className="resource-card-value">
                            ${resource.price}
                        </strong>
                    </div>
                    <div className="resource-card-meta-item">
                        <span className="resource-card-label">
                            Capacity
                        </span>
                        <strong className="resource-card-value">
                            {resource.capacity}
                        </strong>
                    </div>
                </div>
                <div className="resource-card-footer">
                    <span className="resource-card-location">
                        {resource.location || "N/A"}
                    </span>
                </div>
            </div>
        </div>
    )
}