import { RegisterUserDto } from "@shared/types/users";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import {useForm, Controller} from "react-hook-form";
import { registerUser } from "@/api/users";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-native-phone-number-input"
import { useLocationForm } from "@shared/hooks/useLocationForm"

import { styles } from "app/styles/register.styles";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function Register(){
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState("")
    const phoneInput = useRef<PhoneInput>(null)

    const {control, watch, setValue, handleSubmit, formState: {errors}} = useForm<RegisterUserDto>({
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            city: "",
            password: "",
            password_conf: "",
        }
    })

    const password = watch("password")
    const locationForm = useLocationForm()

    useEffect(() => {
        setValue(
            "city",
            locationForm.location
        )
    }, [locationForm.location])

    const onSubmit = async(data: RegisterUserDto) => {
        try{
            setLoading(true)
            setServerError("")

            await registerUser(data)

            router.replace("/user/login")
        } catch(err){
            setServerError("Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return(
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.card}>
                <Text style={styles.title}>
                    Register
                </Text>

                <Controller
                    control={control}
                    name="username"
                    rules={{
                        required: "Username is required",
                        minLength:{
                            value:3,
                            message: "Minimum 3 characters"
                        }
                    }}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput
                            placeholder="Username"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                {errors.username && (
                <Text style={styles.errorText}>
                    {errors.username.message}
                </Text>
                )}

                <Controller
                    control={control}
                    name="email"
                    rules={{required: "Email is required"}}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />

                {errors.email && (
                <Text style={styles.errorText}>
                    {errors.email.message}
                </Text>
                )}

                <PhoneInput 
                    ref={phoneInput}
                    layout="first"
                    onChangeFormattedText={(text) => {
                        setValue(
                            "phone",
                            text
                        )
                    }}

                    
                    containerStyle={{
                        width: "100%",
                        borderRadius: 12,
                        marginBottom: 12
                    }}

                    textContainerStyle={{
                        borderRadius: 12
                    }}
                />

                {errors.phone && (
                <Text style={styles.errorText}>
                    {errors.phone.message}
                </Text>
                )}

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
                                locationForm.selectCountry(
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
                                    locationForm.selectCity(
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

                        <Text style={styles.locationText}>
                            {watch("city")}
                        </Text>

                    </View>
                )}

                {errors.city && (
                <Text style={styles.errorText}>
                    {errors.city.message}
                </Text>
                )}

                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                        },
                        pattern: {
                            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).+$/,
                            message:
                            "Password must contain 1 uppercase letter and 1 special character",
                        },
                    }}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />
                    )}
                />

                {errors.password && (
                <Text style={styles.errorText}>
                    {errors.password.message}
                </Text>
                )}

                <Controller
                    control={control}
                    name="password_conf"
                    rules={{
                        required: "Confirm your password",
                        validate: (value) => 
                            value === password || "Passwords do not match"
                    }}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />
                    )}
                />

                {errors.password_conf && (
                <Text style={styles.errorText}>
                    {errors.password_conf.message}
                </Text>
                )}

                {serverError ? (
                <Text style={styles.serverError}>
                    {serverError}
                </Text>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                    
                >

                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Register
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
        
    )
}