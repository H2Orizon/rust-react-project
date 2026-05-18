import { Picker } from "@react-native-picker/picker"

import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import {View, Text, TextInput, Switch} from "react-native"
import { styles } from "../styles/create-resource-styles"
import { PaymentFor, type CreateResourceDto } from "@shared/types/resource"
import type { CategoryDto } from "@shared/types/category"
import { useEffect } from "react"

import { useLocationForm } from "@shared/hooks/useLocationForm"

type Props = {
    control: Control<CreateResourceDto>

    watch: UseFormWatch<CreateResourceDto>

    setValue:
        UseFormSetValue<CreateResourceDto>

    errors: FieldErrors<CreateResourceDto>

    categories: CategoryDto[]
}

export default function ResourceForm({
    control,
    watch,
    setValue,
    errors,
    categories
}: Props){

    const locationForm =
        useLocationForm(
            watch("location")
        )

    useEffect(() => {

        setValue(
            "location",
            locationForm.location
        )

    }, [locationForm.location])

    return (
        <>

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
                            "Name is required",

                        minLength:{
                            value: 3,
                            message:
                                "Minimum 3 characters"
                        }
                    }}

                    render={({
                        field: {
                            onChange,
                            value
                        }
                    }) => (

                        <TextInput
                            placeholder="Name"

                            style={styles.input}

                            value={value}

                            onChangeText={onChange}
                        />
                    )}
                />

                {errors.name && (
                    <Text>
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

                    render={({
                        field: {
                            onChange,
                            value
                        }
                    }) => (

                        <TextInput
                            multiline
                            numberOfLines={4}

                            placeholder="Description"

                            style={styles.input}

                            value={value}

                            onChangeText={onChange}
                        />
                    )}
                />

            </View>

            {/* PRICE */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Price
                </Text>

                <Controller
                    control={control}
                    name="price"

                    render={({
                        field: {
                            onChange,
                            value
                        }
                    }) => (

                        <TextInput
                            keyboardType="numeric"

                            placeholder="0"

                            style={styles.input}

                            value={String(value)}

                            onChangeText={(text) =>
                                onChange(
                                    Number(text)
                                )
                            }
                        />
                    )}
                />

            </View>

            {/* CAPACITY */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Capacity
                </Text>

                <Controller
                    control={control}
                    name="capacity"

                    render={({
                        field: {
                            onChange,
                            value
                        }
                    }) => (

                        <TextInput
                            keyboardType="numeric"

                            placeholder="0"

                            style={styles.input}

                            value={String(value)}

                            onChangeText={(text) =>
                                onChange(
                                    Number(text)
                                )
                            }
                        />
                    )}
                />

            </View>

            {/* COUNTRY */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Country
                </Text>

                <View style={styles.pickerWrapper}>

                    <Picker
                        selectedValue={
                            locationForm.country
                        }

                        onValueChange={(value) =>
                            locationForm
                                .selectCountry(
                                    String(value)
                                )
                        }
                    >

                        <Picker.Item
                            label="Select country"
                            value=""
                        />

                        {locationForm.countries.map(c => (

                            <Picker.Item
                                key={c.cca2}

                                label={
                                    `${c.flag} ${c.name.common}`
                                }

                                value={c.name.common}
                            />
                        ))}

                    </Picker>

                </View>

            </View>

            {/* CITY */}

            {locationForm.country && (

                <View style={styles.group}>

                    <Text style={styles.label}>
                        City
                    </Text>

                    <View style={styles.pickerWrapper}>

                        <Picker
                            selectedValue={
                                locationForm.city
                            }

                            onValueChange={(value) =>
                                locationForm
                                    .selectCity(
                                        String(value)
                                    )
                            }
                        >

                            <Picker.Item
                                label="Select city"
                                value=""
                            />

                            {locationForm.cities.map(c => (

                                <Picker.Item
                                    key={c}
                                    label={c}
                                    value={c}
                                />
                            ))}

                        </Picker>

                    </View>

                    <Text
                        style={styles.locationText}
                    >
                        {watch("location")}
                    </Text>

                </View>
            )}

            {/* CATEGORY */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Category
                </Text>

                <View style={styles.pickerWrapper}>

                    <Picker
                        selectedValue={
                            watch("category_id")
                        }

                        onValueChange={(value) =>
                            setValue(
                                "category_id",
                                Number(value)
                            )
                        }
                    >

                        {categories.map(c => (

                            <Picker.Item
                                key={c.id}
                                label={c.name}
                                value={c.id}
                            />
                        ))}

                    </Picker>

                </View>

            </View>

            {/* PAYMENT */}

            <View style={styles.group}>

                <Text style={styles.label}>
                    Payment For
                </Text>

                <View style={styles.pickerWrapper}>

                    <Picker
                        selectedValue={
                            watch("payment_for")
                        }

                        onValueChange={(value) =>
                            setValue(
                                "payment_for",
                                value
                            )
                        }
                    >

                        {Object.values(
                            PaymentFor
                        ).map(p => (

                            <Picker.Item
                                key={p}
                                label={p}
                                value={p}
                            />
                        ))}

                    </Picker>

                </View>

            </View>

            {/* AUTO APPROVE */}

            <View style={styles.switchCard}>

                <View>

                    <Text style={styles.switchTitle}>
                        Auto Approve
                    </Text>

                </View>

                <Switch
                    value={
                        watch(
                            "auto_approved"
                        )
                    }

                    onValueChange={(value) =>
                        setValue(
                            "auto_approved",
                            value
                        )
                    }
                />

            </View>

        </>
    )
}