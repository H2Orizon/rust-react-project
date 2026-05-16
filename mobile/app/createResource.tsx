import { getCategories } from "@/api/categories"
import { createResource } from "@/api/resources"
import { Picker } from "@react-native-picker/picker"
import { Text } from "@react-navigation/elements"
import { CategoryDto } from "@shared/types/category"
import { CreateResourceDto, PaymentFor } from "@shared/types/resource"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, Switch, TextInput, TouchableOpacity, View } from "react-native"

import { styles } from "app/styles/create-resource-styles"

export default function CreateResource() {
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
            auto_approve: false,
            payment_for: PaymentFor.Day
        }
    })

    const autoApprove = watch("auto_approve")

    const onSubmit = async(data: CreateResourceDto) => {
        try{
            setLoading(true)
            setError("")

            await createResource(data)

            router.replace(`/`)
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

                <View>
                    <Text style={styles.title}>
                        Create Resource
                    </Text>
                    <Text style={styles.subtitle}>
                        Fill all required fields
                    </Text>

                </View>

                {error && (

                    <View style={styles.errorBox}>

                        <Text style={styles.errorText}>
                            {error}
                        </Text>

                    </View>
                )}

                {/* NAME */}
                <View style={styles.group}>

                <Text style={styles.label}>
                    Name
                </Text>

                <Controller 
                    control={control}
                    name="name"
                    rules={{
                        required: "Name is required",
                        minLength:{
                            value:3,
                            message: "Minimum 3 characters"
                        }
                    }}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput 
                            placeholder="Resource name"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                    {errors.name && (
                        <Text>
                            {errors.name?.message}
                        </Text>
                    )}

                </View>

                <View style={styles.group}>

                    <Text style={styles.label}>
                        Description
                    </Text>

                    <Controller 
                        control={control}
                        name="description"
                        rules={{
                            required: "Description is required",
                            minLength:{
                                value:10,
                                message: "Minimum 3 characters"
                            }
                        }}
                        render={({field: {onChange, onBlur, value} }) => (
                            <TextInput
                                multiline
                                numberOfLines={4}
                                placeholder="Description"
                                style={styles.input}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />

                    {errors.description && (
                        <Text>
                            {errors.description?.message}
                        </Text>
                    )}
                </View>

            {/* PRICE + CAPACITY */}

            <View style={styles.row}>

                <View style={styles.flex}>

                    <Text style={styles.label}>
                        Price
                    </Text>

                    <Controller 
                        control={control}
                        name="price"
                        rules={{required: "Price is required"}}
                        render={({field: {onChange, onBlur, value} }) => (
                                <TextInput
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#9ca3af"
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={(text) =>
                                    onChange(
                                        Number(text)
                                    )
                                }
                                value={String(value)}
                            />
                        )}
                    />

                <View style={styles.pickerWrapper}>

                    <Picker
                        selectedValue={watch("payment_for")}
                        onValueChange={(value) =>
                            setValue(
                                "payment_for",
                                value
                            )
                        }
                    >
                        {Object.values(PaymentFor).map((p) =>
                            <Picker.Item key={p} label={p} value={p}/>
                        )}
                    </Picker>
                </View>

                {errors.price && (
                    <Text>
                        {errors.price?.message}
                    </Text>
                )}

                </View>

                <View style={styles.flex}>

                    <Text style={styles.label}>
                        Capacity
                    </Text>

                    <Controller 
                        control={control}
                        name="capacity"
                        rules={{ required: "Capacity is required" }}
                        render={({field: {onChange, onBlur, value} }) => (
                            <TextInput
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#9ca3af"
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={(text) =>
                                    onChange(
                                        Number(text)
                                    )
                                }
                                value={String(value)}
                            />
                        )}
                    />
                </View>

                </View>

                {errors.capacity && (
                    <Text>
                        {errors.capacity?.message}
                    </Text>
                )}

                {/* LOCATION */}

                <View style={styles.group}>

                    <Text style={styles.label}>
                        Location
                    </Text>
                    
                    <Controller 
                        control={control}
                        name="location"
                        render={({field: {onChange, onBlur, value} }) => (
                            <TextInput
                                placeholder="Location"
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                {errors.location && (
                    <Text>
                        {errors.location?.message}
                    </Text>
                )}
                </View>


                {/* CATEGORY */}
                <View style={styles.group}>

                    <Text style={styles.label}>
                        Category
                    </Text>

                    <View style={styles.pickerWrapper}>

                        <Picker
                            selectedValue={watch("category_id")}
                            onValueChange={(value) =>
                                setValue(
                                    "category_id",
                                    value
                                )
                            }
                        >
                            {categories.map(c =>(
                                <Picker.Item key={c.id} label={c.name} value={c.id} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.switchCard}>

                    <View>

                        <Text style={styles.switchTitle}>
                            Auto Approve
                        </Text>

                        <Text style={styles.switchText}>
                            Automatically approve
                            bookings
                        </Text>

                    </View>

                    <Switch
                        value={autoApprove}
                        onValueChange={(value) =>
                            setValue(
                                "auto_approve",
                                value
                            )
                        }
                    />

                </View>


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