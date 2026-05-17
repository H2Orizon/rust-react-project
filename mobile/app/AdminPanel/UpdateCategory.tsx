import { updateCategory } from "@/api/categories";
import { CategoryDto, CreateCategoryDto } from "@shared/types/category";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { styles } from "app/styles/create-category.styles"

type Props ={
    category: CategoryDto
    onUpdated?: (category: CategoryDto) => void
}

export default function UpdateCategory({category, onUpdated}: Props){
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState("")

    const {control, watch, setValue, handleSubmit, formState:{errors}} = useForm<CreateCategoryDto>({
        defaultValues:{
            name: category.name,
            description: category.description,
            is_movable: category.is_movable
        }
    })

    const isMovable = watch("is_movable")

    const onSubmit = async(data: CreateCategoryDto) => {
        try{
            setLoading(true)
            setServerError("")

            const updatedCategory = await updateCategory(data, category.id)

            if(onUpdated){
                onUpdated(updatedCategory)
            }

        } catch(err: any){
            setServerError("")
        } finally{
            setLoading(false)
        }
    }

    return(

        <View style={styles.card}>

            <Text style={styles.title}>
                Create Category
            </Text>

            <Text style={styles.subtitle}>
                Add a new resource category
            </Text>

            {serverError ? (

                <Text style={styles.serverError}>
                    {serverError}
                </Text>

            ) : null}

            {/* NAME */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Name
                </Text>

                <Controller
                    control={control}
                    name="name"
                    rules={{
                        required:
                            "Name is required"
                    }}
                    render={({
                        field: {
                            onChange,
                            onBlur,
                            value
                        }
                    }) => (

                        <TextInput
                            placeholder="Category name"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                {errors.name && (

                    <Text style={styles.error}>
                        {errors.name.message}
                    </Text>
                )}

            </View>

            {/* DESCRIPTION */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Description
                </Text>

                <Controller
                    control={control}
                    name="description"
                    rules={{
                        required:
                            "Description is required"
                    }}
                    render={({
                        field: {
                            onBlur,
                            onChange,
                            value
                        }
                    }) => (

                        <TextInput
                            placeholder="Description"
                            style={[
                                styles.input,
                                styles.textarea
                            ]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                            numberOfLines={4}
                        />
                    )}
                />

                {errors.description && (

                    <Text style={styles.error}>
                        {errors.description.message}
                    </Text>
                )}

                <Text>
                    Is movable
                    <Switch
                        value={isMovable}
                        onValueChange={(value) =>
                            setValue(
                                "is_movable",
                                value
                            )
                        }
                    />
                </Text>

            </View>

            {/* BUTTON */}

            <TouchableOpacity
                style={[
                    styles.button,
                    loading &&
                    styles.buttonDisabled
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.85}
            >

                {loading ? (

                    <ActivityIndicator
                        color="#fff"
                    />

                ) : (

                    <Text style={styles.buttonText}>
                        Create Category
                    </Text>
                )}

            </TouchableOpacity>

        </View>
    )
}