import { getCategories } from "@/api/categories"
import { createResource } from "@/api/resources"
import { Text } from "@react-navigation/elements"
import { CategoryDto } from "@shared/types/category"
import { CreateResourceDto, PaymentFor } from "@shared/types/resource"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ScrollView, TouchableOpacity, View } from "react-native"

import { styles } from "app/styles/create-resource-styles"
import { useAuth } from "@/context/AuthContext"
import ResourceForm from "./resources/ResourceForm"
import Toast from "react-native-toast-message"

export default function CreateResource() {
    const {user} = useAuth()

    if(user?.id === 0) router.replace('/')

    const [categories, setCategories] = useState<CategoryDto[]>([])

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {control, watch, handleSubmit, setValue, formState:{errors}} = useForm<CreateResourceDto>({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            capacity: 0,
            location: "",
            category_id: 1,
            auto_approved: false,
            payment_for: PaymentFor.Day
        }
    })

    const onSubmit = async(data: CreateResourceDto) => {
        try{
            setLoading(true)
            setError("")

            await createResource(data)

            router.replace(`/`)
        }catch(err){
            Toast.show({
                type: "error",
                text1: "Create Resource Failed"
            })

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
                                : "Create Resoutce"
                            }
                    </Text>
                </TouchableOpacity>
                
            </View>
        </ScrollView>
    )
}