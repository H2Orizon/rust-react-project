import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { ResourceDto } from "../types/resource";
import { deleteResourceApi, getResource } from "../api/resources";

export default function Resource() {

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
        <div>
            {error && <p style={{color:"red"}}>{error}</p>}
            <h1>Resource {resource.id}</h1>
            <h3>{resource.name}</h3>
            <p>{resource.description}</p>
            <p>Price: {resource.price} $</p>
            <p>Capacity: {resource.capacity}</p>
            <p>Category: {resource.category}</p>
            <button onClick={() => deleteResource(resource.id)}>Delete</button>
        </div>
    )

}