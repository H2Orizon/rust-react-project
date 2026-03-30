import { useNavigate } from "react-router"
import type { ResourceDto } from "../../types/resource"

type Props = {
    resource: ResourceDto
}

export default function ResourceCard({resource}: Props) {

    const navigator = useNavigate()

    return(
        <div 
            className="resource-card"
            onClick={() => navigator(`/resources/${resource.id}`)}
        >

            <div className="resource-card-image">
                Image
            </div>

            <div className="resource-card-content">
                <h3>{resource.name}</h3>

                <p className="resource-card-description">
                    {resource.description}
                </p>

                <div className="resource-card-meta">
                    <span>{resource.price}$</span>
                    <span>{resource.capacity} Capacity</span>
                </div>

                <div className="resource-card-footer">
                    <span>{resource.category}</span>
                    <span>{resource.location || "N/A"}</span>
                </div>

            </div>

        </div>
    )
}