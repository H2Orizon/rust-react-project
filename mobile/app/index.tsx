import { getCategories } from "@/api/categories"
import { useEffect, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { CategoryDto } from "@shared/types/category"
import { PaginatedResponse, ResourceQuery } from "@shared/types/resource"
import { getResources } from "@/api/resources"
import ResourceCard from "./resources/ResourceCard"

export default function Home() {

    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [data, setData] = useState<PaginatedResponse>()
    const [query, setQuery] = useState<ResourceQuery>({
        resource_name: undefined,
         category: undefined,
         min_price: undefined,
         max_price: undefined,
         per_page: 10,
         page: 1
    })

    const resources = data?.resources || []

    useEffect(() =>{
        const timeout = setTimeout(() => {
            return () => clearTimeout(timeout)
        }, 300)
        getResources(query).then(setData)

    }, [query])
    useEffect(() =>{
        getCategories().then(setCategories)
    }, [])

    if (!resources){
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    return(
        <ScrollView>
            <View> 
                {
                resources.map(r => {
                    return <ResourceCard key={r.id} resource={r} />
                })
                }
            </View>
         </ScrollView>
    )
}