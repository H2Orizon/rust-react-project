import { useEffect, useState } from "react";
import ResourceCard from "../Resource/ResourceCard";
import { getResources } from "../../api/resources";
import type { ResourceListDto, ResourceQuery } from "../../../../shared/types/resource";

type Props = {
    userId: number
}

export default function UserResources({userId}: Props) {

    const [userResources, setUserResorces] = useState<ResourceListDto[]>([])
    const [resourceQuery] = useState<ResourceQuery>({
        user_id: userId
    })

    useEffect(() => {
        if (!userId) return

        getResources(resourceQuery).then(setUserResorces)
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