import { useNavigate } from "react-router"
import type { ResourceDto } from "../types/resource"

type Props = {
    resource: ResourceDto
}

export default function ResourceCard({resource}: Props) {

    const navigator = useNavigate()

    return(
        <div>
            <h3 onClick={() => navigator(`/resources/${resource.id}`)}>{resource.name}</h3>
            <p>{resource.description}</p>
            <p>Price: {resource.price} $</p>
            <p>Capacity: {resource.capacity}</p>   
            <p>Category: {resource.category}</p>
        </div>
    )
}