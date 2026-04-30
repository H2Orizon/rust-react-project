import { useNavigate } from "react-router"
import type { ResourceListDto } from "../../../../shared/types/resource"

type Props = {
    resource: ResourceListDto
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

                <div className="resource-card-meta">
                    <span>{resource.price}$</span>
                    <span>{resource.capacity} Capacity</span>
                </div>

                <div className="resource-card-footer">
                    <span>{resource.category}</span>
                    <span>{resource.location || "N/A"}</span>
                    <span>{resource.availble_now} availble now</span>
                </div>

            </div>

        </div>
    )
}