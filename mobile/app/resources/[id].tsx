import { useEffect, useState } from "react";
import { ResourceDto } from "@shared/types/resource";
import { deleteResource, getResource } from "@/api/resources";
import { useLocalSearchParams  } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";

import styles from "../styles/resource.styles"

export default function Resource(){
    const {id} = useLocalSearchParams()

    const [resource, setResource] = useState<ResourceDto>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if(!id) return

        getResource(Number(id)).then(setResource)
    }, [id])

    if(!resource){
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                    Loading...
                </Text>
            </View>
        )
    }

    const delete_resource = async (id: number) => {
        try{
            setError(null)
            await deleteResource(id)
            
        }catch(error){
            setError("Failed to delete resource")
        }
    }

    return(
        <ScrollView style={styles.container}>
            
            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>
                    Carousel Images
                </Text>
            </View>

            <View style={styles.content}>
                
                <Text style={styles.title}>
                    {resource.name}
                </Text>

                <View style={styles.infoContainer}>

                    <View style={styles.infoTag}>
                        <Text style={styles.infoText}>
                            {resource.price}$
                        </Text>
                    </View>

                    <View style={styles.infoTag}>
                        <Text style={styles.infoText}>
                            {resource.capacity}
                        </Text>
                    </View>

                    <View style={styles.infoTag}>
                        <Text style={styles.infoText}>
                            {resource.category}
                        </Text>
                    </View>

                </View>

                {resource.availble_now > 0 ? (
                    <Text style={styles.available}>
                        Available: {resource.availble_now}
                    </Text>
                ) : (
                    <Text style={styles.unavailable}>
                        Fully booked.
                        {"\n"}
                        Available again at:
                        {"\n"}
                        {new Date(resource.next_available_at).toLocaleString()}
                    </Text>
                )}

                <Text style={styles.description}>
                    {resource.description}
                </Text>

                <Pressable
                    style={styles.deleteButton}
                    onPress={() => delete_resource(resource.id)}
                >
                    <Text style={styles.deleteButtonText}>
                        Delete Resource
                    </Text>
                </Pressable>

            </View>
        </ScrollView>
    )

}