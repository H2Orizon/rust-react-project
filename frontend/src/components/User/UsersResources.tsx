import { useEffect, useState } from "react";
import ResourceCard from "../Resource/ResourceCard";
import { getResources } from "../../api/resources";
import type { ResourceListDto } from "../../../../shared/types/resource";

type Props = {
    userId: number
}

export default function UserResources({userId}: Props) {

    const [userResources, setUserResorces] = useState<ResourceListDto[]>([])

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