import { RegisterUserDto } from "@shared/types/users";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import {useForm, Controller} from "react-hook-form";
import { registerUser } from "@/api/users";
import { useState } from "react";

import styles from "app/styles/register.styles";
import { router } from "expo-router";

export default function Register(){
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState("")

    const {control, watch, handleSubmit, formState: {errors}} = useForm<RegisterUserDto>({
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            city: "",
            password: "",
            password_conf: "",
        }
    })

    //todo

    const password = watch("password")

    const onSubmit = async(data: RegisterUserDto) => {
        try{
            setLoading(true)
            setServerError("")

            await registerUser(data)

            router.replace("./user/login")
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

                <Controller
                    control={control}
                    name="phone"
                    rules={{required: "Phone is required"}}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput
                            placeholder="Phone"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="phone-pad"
                        />
                    )}
                />

                {errors.phone && (
                <Text style={styles.errorText}>
                    {errors.phone.message}
                </Text>
                )}

                <Controller
                    control={control}
                    name="city"
                    rules={{required: "City is required"}}
                    render={({field: {onChange, onBlur, value} }) => (
                        <TextInput
                            placeholder="City"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

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
                            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
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