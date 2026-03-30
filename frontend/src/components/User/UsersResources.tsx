import { useEffect, useState } from "react";
import type { ResourceDto } from "../../types/resource";
import ResourceCard from "../Resource/ResourceCard";
import { getResources } from "../../api/resources";

type Props = {
    userId: number
}

export default function UserResources({userId}: Props) {

    const [userResources, setUserResorces] = useState<ResourceDto[]>([])

    useEffect(() => {
        if (!userId) return

        getResources(Number(userId)).then(setUserResorces)
    }, [userId])
    
    return(
        <div>
            <h2>User Resources</h2>
            {Array.isArray(userResources) && userResources.map(r =>
                <ResourceCard key={r.id} resource={r}/>
            )}
        </div>
    )
}