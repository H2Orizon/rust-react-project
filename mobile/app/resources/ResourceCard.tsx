import { View, Text, Pressable, Image } from "react-native"
import { ResourceListDto } from "@shared/types/resource"
import { Link } from "expo-router"

import styles from "app/styles/resourceCard.styles"

type Props = {
    resource: ResourceListDto
}

export default function ResourceCard({ resource }: Props) {

    const image = resource.image || undefined

    return (
        <Link href={`/resources/${resource.id}`} asChild>
            <Pressable style={styles.card}>
                
                <View style={styles.imagePlaceholder}>
                    {resource.image 
                        ? <Image source={{uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${image?.path}`}}
                                style={{
                                    width: "100%",
                                    height: 200,
                                    borderRadius: 12
                                }}
                            />
                        : <Text style={styles.imageText}>No Image</Text>
                    }
                </View>

                <View style={styles.content}>
                    
                    <Text style={styles.title}>
                        {resource.name}
                    </Text>

                    <View style={styles.row}>
                        <Text style={styles.price}>
                            ${resource.price}/{resource.payment_for}
                        </Text>

                        <Text style={styles.capacity}>
                            {resource.capacity}
                        </Text>
                    </View>

                    <View style={styles.tags}>
                        
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>
                                {resource.category}
                            </Text>
                        </View>

                        <View style={styles.tag}>
                            <Text style={styles.tagText}>
                                📍 {resource.location || "N/A"}
                            </Text>
                        </View>

                        <View style={styles.tag}>
                            <Text style={styles.tagText}>
                                Available: {resource.availble_now}
                            </Text>
                        </View>

                    </View>

                </View>
            </Pressable>
        </Link>
    )
}
