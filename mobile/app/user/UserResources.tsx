import { getResources } from "@/api/resources"
import { PaginatedResponse, ResourceQuery } from "@shared/types/resource"
import ResourceCard from "../resources/ResourceCard"
import { useEffect, useState } from "react"
import { View, Text } from "react-native"

type Props = {
    userId: number
}

export default function UserResources({userId}: Props) {
    const [userResources, setUserResorces] = useState<PaginatedResponse>()
    const [resourceQuery] = useState<ResourceQuery>({
        user_id: userId
    })

    const resources = userResources?.resources || []

    useEffect(() => {
        if (!userId) return

        getResources(resourceQuery).then(setUserResorces)
    }, [userId])

    return(
        <View>
            <Text>User Resources</Text>
            {Array.isArray(resources) && resources.map(r => (
                <ResourceCard key={r.id} resource={r} />
            ))}
        </View>
    )
}