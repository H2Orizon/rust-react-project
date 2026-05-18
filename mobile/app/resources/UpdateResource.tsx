import { getCategories } from "@/api/categories"
import { updateResources } from "@/api/resources"
import { Text } from "@react-navigation/elements"
import { CategoryDto } from "@shared/types/category"
import { CreateResourceDto, PaymentFor, ResourceDto } from "@shared/types/resource"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ScrollView, TouchableOpacity, View } from "react-native"
import ResourceForm from "./ResourceForm"

import { styles } from "app/styles/create-resource-styles"

type Props = {
    resource: ResourceDto
    onUpdated: () => void
}

export default function UpdateResource({resource, onUpdated}: Props) {
    const [categories, setCategories] = useState<CategoryDto[]>([])

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const category_id = categories.find((c) => (c.name === resource.category))?.id || 1


    const {control, watch, handleSubmit, setValue, formState:{errors}} = useForm<CreateResourceDto>({
        defaultValues: {
            name: resource.name,
            description: resource.description,
            price: resource.capacity,
            capacity: resource.capacity,
            location: resource.location,
            category_id: category_id,
            auto_approved: false,
            payment_for: PaymentFor.Day
        }
    })

    const onSubmit = async(data: CreateResourceDto) => {
        try{
            setLoading(true)
            setError("")

            await updateResources(data, resource.id)

            onUpdated()

        }catch(err){
            setError("Create Resource Failed")
        } finally{
            setLoading(false)
        }
    }

    return(
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.card}>

                <ResourceForm 
                    control={control}
                    categories={categories}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                />

                {error && (

                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    disabled={loading}
                    onPress={handleSubmit(onSubmit)}
                    activeOpacity={0.85}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                            {loading 
                                ? "Creating..."
                                : "Update Resoutce"
                            }
                    </Text>
                </TouchableOpacity>
                
            </View>
        </ScrollView>
    )
}