import { useEffect, useState } from "react";
import type { ResourceDto } from "../types/resource";
import { getResources } from "../api/resources";
import ResourceCard from "../components/ResourceCard";

export default function Resources() {
    const [resources, setResources] = useState<ResourceDto[]>([])

    useEffect(() =>{
        getResources().then(setResources)
    }, [])

    return(
        <div>
            <h1>Resources</h1>

            {resources.map(r => (
                <ResourceCard key={r.id} resource={r}/>
            ))}
        </div>
    )
}