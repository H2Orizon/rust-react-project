import { loginUser } from "@/api/users";
import { UserLoginDto } from "@shared/types/users";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "app/styles/login.styles";
import { TextInput, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";

export default function Login() {
    const [loading, setLoading] = useState(false)
    const {login} = useAuth()
    const [serverError, setServerError] = useState("")
    const {control, handleSubmit, formState: {errors}} = useForm<UserLoginDto>({
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async(data: UserLoginDto) => {
        try{
            setLoading(true);
            setServerError("");
            
            const token = await loginUser(data)
            await login(token)

            Toast.show({
                type: "success",
                text1: "Welcome"
            })

            router.replace("/")
        }catch(err: any){

            Toast.show({
                type: "error",
                text1: "Invalid Credentials"
            })

            setServerError("Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    return(
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.card}>

                    <Text style={styles.title}>Login</Text>

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
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
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
                        name="password"
                        rules={{
                            required: "Password is required",
                            minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                            },
                        }}
                        render={({field: {onChange, onBlur, value} }) =>(
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
                                Login
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView>
    )
}